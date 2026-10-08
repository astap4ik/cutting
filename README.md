# Cutting

Статическое браузерное приложение «Раскройщик онлайн».

Для разработки запусти из корня проекта:

```powershell
node dev-server.js
```

Затем открой http://127.0.0.1:5500/ в браузере. Сервер работает, пока открыта команда; `Ctrl+C` останавливает его. Изменения в `index.html`, `src/` и `assets/` автоматически перезагружают страницу. Внешний AG Grid загружается с CDN.

Данные в `localStorage` у `file://` и `http://127.0.0.1:5500` раздельные. Для переноса проекта используй экспорт и импорт JSON в приложении.

Исходники находятся в `src/`, тесты — в `tests/`. Рабочие заметки Codex — в `.codex/`.

Быстрая проверка:

```powershell
node tests/optimizer.test.js
node tests/search-ui.test.js
node tests/drag-transfer.test.js
```
