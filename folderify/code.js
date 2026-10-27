// Folderify — весь функционал теперь внутри самого плагина: никакого
// отдельного десктоп-приложения не требуется. Песочница плагина (этот файл)
// отвечает за общение с самой Figma — выделение и экспорт нод; вся остальная
// логика (сеть, UI, Яндекс.Диск) — в ui.html, у него есть доступ к fetch.

figma.showUI(__html__, { width: 360, height: 600, themeColors: true });

const STORAGE_KEY = 'folderify-settings';

function describeSelection() {
  return figma.currentPage.selection.map((node) => ({
    id: node.id,
    name: node.name,
    type: node.type,
    width: Math.round(node.width),
    height: Math.round(node.height)
  }));
}

function sendSelection() {
  figma.ui.postMessage({ type: 'SELECTION_CHANGED', nodes: describeSelection() });
}

sendSelection();
figma.on('selectionchange', sendSelection);

// Общий кэш в памяти вместо чтения с диска на каждую запись. Раньше
// SET_STORAGE каждый раз делал getAsync -> изменить -> setAsync; когда
// несколько таких запросов (токен, логин, имя) прилетали почти
// одновременно, они читали ОДНО И ТО ЖЕ старое состояние параллельно и
// последняя запись затирала предыдущие — токен мог просто потеряться.
// Теперь все изменения применяются к одному общему объекту в памяти, и
// какая бы запись ни завершилась последней, в ней уже есть все изменения.
let storageCache = null;

async function getStorageCache() {
  if (storageCache === null) {
    storageCache = (await figma.clientStorage.getAsync(STORAGE_KEY)) || {};
  }
  return storageCache;
}

figma.ui.onmessage = async (msg) => {
  // Ждём явного сигнала "панель готова", прежде чем слать сохранённые
  // данные (токен и т.п.) — раньше отправляли сразу при старте плагина,
  // и если панель ещё не успела подписаться на приём сообщений, данные
  // просто терялись.
  if (msg.type === 'UI_READY') {
    const data = await getStorageCache();
    figma.ui.postMessage({ type: 'INIT_STORAGE', storage: data });
    return;
  }

  if (msg.type === 'REQUEST_SELECTION') {
    sendSelection();
    return;
  }

  if (msg.type === 'SET_STORAGE') {
    const cache = await getStorageCache();
    cache[msg.key] = msg.value;
    await figma.clientStorage.setAsync(STORAGE_KEY, cache);
    return;
  }

  if (msg.type === 'SET_STORAGE_BATCH') {
    const cache = await getStorageCache();
    Object.assign(cache, msg.values || {});
    await figma.clientStorage.setAsync(STORAGE_KEY, cache);
    return;
  }

  if (msg.type === 'NOTIFY') {
    figma.notify(msg.message, { error: Boolean(msg.error), timeout: msg.timeout || 3000 });
    return;
  }

  if (msg.type === 'EXPORT_REQUEST') {
    const { format, scale, nodeIds, requestId } = msg;
    const selection = figma.currentPage.selection.filter((n) => nodeIds.includes(n.id));
    const setting = { format: format || 'PNG', constraint: { type: 'SCALE', value: scale || 1 } };

    const results = [];
    for (const node of selection) {
      try {
        const bytes = await node.exportAsync(setting);
        results.push({
          id: node.id,
          name: node.name,
          width: Math.round(node.width),
          height: Math.round(node.height),
          base64: figma.base64Encode(bytes),
          format: setting.format
        });
      } catch (error) {
        results.push({ id: node.id, name: node.name, error: String((error && error.message) || error) });
      }
    }

    figma.ui.postMessage({ type: 'EXPORT_RESULT', requestId, results });
  }
};
