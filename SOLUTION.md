# SOLUTION.md

## ✅ Refactors & Improvements

### 1. Replaced Blocking File I/O

- Removed all `fs.readFileSync` and `fs.writeFileSync`.
- Replaced with async versions using `fs.promises`.

### 2. Added File Cache with Chokidar

- Introduced a file-level cache to avoid repeated reads.
- Used `chokidar` to watch file changes and refresh cache automatically.

### 3. Controller and Service Separation

- Moved business logic from `ItemsController` into `ItemsService`.
- Did the same for stats: `StatsController` now delegates to `StatsService`.

### 4. Input Validation with Yup

- Used `yup` to validate POST payloads.
- Enforces required fields: `name`, `category`, and `price` with correct types.

### 5. Pagination & Query Support

- Implemented `limit` and `offset` in `/api/items`.
- Query param `q` performs basic `toLowerCase().includes()` search on `name`.

### 6. Stats Optimization

- Moved stat calculation (`total`, `averagePrice`) into `StatsService`.
- Uses cached data when possible for performance.

---

## 🧪 Tests (Jest)

### Unit Tests

- ✅ `ItemsController.test.js`: list, getById, create (valid/invalid)
- ✅ `StatsController.test.js`: returns stats, handles service error

### Jest Config

- Custom config in `jest.config.js`
- Can run specific test sets with `npm run test:stats`

---

## 📄 API Docs

- Swagger set up via `swagger-jsdoc` and `swagger-ui-express`
- Swagger UI available at `/api/docs`
- Annotations added directly in `routes/index.js`

---

## 📁 Backend Structure
