# Language Learning Web — Kế hoạch dự án

> Web học Anh/Trung/Nhật cho người Việt, tập trung Nghe + Đọc, AI sinh toàn bộ nội dung.

---

## 1. Tổng quan

**Mục tiêu:** Xây dựng web ứng dụng học ngôn ngữ miễn phí, dành cho người Việt học 3 ngôn ngữ: **Anh (en)**, **Trung (zh)**, **Nhật (ja)**.

**Điểm khác biệt cốt lõi:**
- Content do AI sinh (Gemini) — không biên soạn thủ công, mở rộng không giới hạn
- Tập trung Nghe + Đọc — bỏ Speaking/Writing vì tốn AI
- Không dùng SRS cố định — user tự đánh dấu bài đã học, AI sinh đề kiểm tra application-based
- Kiến trúc tối giản: không RBAC phức tạp, không multi-provider ngay từ đầu
- Dành riêng cho người Việt

---

## 2. Đối tượng người dùng

- Người Việt tự học Anh/Trung/Nhật, trình độ A0 → C2
- Muốn học qua nội dung thực tế (AI sinh) thay vì giáo trình khô khan
- Không cần giáo viên, không trả phí
- Tự chọn trình độ khởi điểm qua Placement Wizard, có thể đổi bất cứ lúc nào

---

## 3. Tech Stack

| Layer | Công nghệ | Ghi chú |
|---|---|---|
| Frontend | Next.js 16 + React 19 + Tailwind v4 | ⚠️ Next.js 16 có breaking changes |
| Backend | NestJS 11 + TypeScript | Express nền tảng |
| Database | PostgreSQL + TypeORM | |
| Auth | JWT (email + password) + bcrypt | |
| AI | Gemini API | 1 provider, key trong env |
| TTS | Edge-TTS (free) | Phát âm từ, bài nghe |

---

## 4. Database Schema

### 4.1 users

```sql
CREATE TABLE users (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email           VARCHAR(255) UNIQUE NOT NULL,
  password_hash   VARCHAR(255) NOT NULL,
  name            VARCHAR(100),
  role            VARCHAR(10) NOT NULL DEFAULT 'user'
                  CHECK (role IN ('user', 'admin')),
  target_lang     VARCHAR(2) NOT NULL
                  CHECK (target_lang IN ('en', 'zh', 'ja')),
  current_level   VARCHAR(2) NOT NULL DEFAULT 'a0'
                  CHECK (current_level IN ('a0','a1','a2','b1','b2','c1','c2')),
  placement_done  BOOLEAN NOT NULL DEFAULT FALSE,
  daily_limit     INT NOT NULL DEFAULT 5,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### 4.2 languages

```sql
CREATE TABLE languages (
  code          VARCHAR(2) PRIMARY KEY
                CHECK (code IN ('en', 'zh', 'ja')),
  name          VARCHAR(50) NOT NULL,
  native_name   VARCHAR(50) NOT NULL,
  script_type   VARCHAR(20) NOT NULL
                CHECK (script_type IN ('latin', 'hanzi', 'kana-kanji'))
);
```

3 rows mặc định: (`'en', 'English', 'English', 'latin'`), (`'zh', '中文', 'Tiếng Trung', 'hanzi'`), (`'ja', '日本語', 'Tiếng Nhật', 'kana-kanji'`).

### 4.3 contents

```sql
CREATE TABLE contents (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  language        VARCHAR(2) NOT NULL REFERENCES languages(code),
  level           VARCHAR(2) NOT NULL
                  CHECK (level IN ('a0','a1','a2','b1','b2','c1','c2')),
  type            VARCHAR(10) NOT NULL
                  CHECK (type IN ('reading', 'listening')),
  title           VARCHAR(255) NOT NULL,
  body            TEXT NOT NULL,
  ai_summary      TEXT,
  ai_vocabulary   JSONB,  -- [{word, ipa, pos, definition, example}]
  ai_quiz         JSONB,  -- [{type, question, options, correct_answer}]
  is_published    BOOLEAN NOT NULL DEFAULT TRUE,
  created_by      UUID REFERENCES users(id),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_contents_lang_level ON contents(language, level);
```

### 4.4 user_progress

```sql
CREATE TABLE user_progress (
  user_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content_id    UUID NOT NULL REFERENCES contents(id) ON DELETE CASCADE,
  completed_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, content_id)
);
```

### 4.5 user_vocabulary

```sql
CREATE TABLE user_vocabulary (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content_id      UUID REFERENCES contents(id) ON DELETE SET NULL,
  language        VARCHAR(2) NOT NULL REFERENCES languages(code),
  word            VARCHAR(255) NOT NULL,
  definition      TEXT NOT NULL,
  ipa             VARCHAR(100),
  example         TEXT,
  notes           TEXT,
  times_reviewed  INT NOT NULL DEFAULT 0,
  learned_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_uv_user ON user_vocabulary(user_id);
```

### 4.6 quiz_attempts

```sql
CREATE TABLE quiz_attempts (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  source_ids    JSONB NOT NULL,         -- [content_id, ...]
  questions     JSONB NOT NULL,         -- snapshot câu hỏi AI sinh
  user_answers  JSONB,                  -- câu trả lời của user
  mode          VARCHAR(10) NOT NULL
                CHECK (mode IN ('random', 'all', 'custom')),
  taken_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

---

## 5. Kiến trúc Backend (NestJS Modules)

```
src/
├── main.ts
├── app.module.ts
├── auth/
│   ├── auth.module.ts
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   ├── jwt.strategy.ts
│   └── guards/
│       └── roles.guard.ts          ← chỉ check admin/user
├── users/
│   ├── users.module.ts
│   ├── users.controller.ts
│   ├── users.service.ts
│   └── entities/user.entity.ts
├── placement/
│   ├── placement.module.ts
│   ├── placement.controller.ts
│   ├── placement.service.ts
│   └── placement.wizard.ts         ← logic sinh câu hỏi + gợi ý level
├── contents/
│   ├── contents.module.ts
│   ├── contents.controller.ts
│   ├── contents.service.ts
│   ├── entities/content.entity.ts
│   └── ai-generator.service.ts     ← gọi Gemini, parse response
├── progress/
│   ├── progress.module.ts
│   ├── progress.controller.ts
│   └── progress.service.ts
├── vocabulary/
│   ├── vocabulary.module.ts
│   ├── vocabulary.controller.ts
│   ├── vocabulary.service.ts
│   └── entities/vocabulary.entity.ts
├── quiz/
│   ├── quiz.module.ts
│   ├── quiz.controller.ts
│   ├── quiz.service.ts
│   └── ai-quiz-generator.service.ts
├── admin/
│   ├── admin.module.ts
│   ├── admin.controller.ts
│   └── admin.service.ts
└── common/
    ├── decorators/
    │   ├── current-user.decorator.ts
    │   └── roles.decorator.ts
    └── guards/
        └── jwt-auth.guard.ts
```

---

## 6. Kiến trúc Frontend (Next.js Pages)

```
app/
├── layout.tsx                    ← Root layout + AuthProvider
├── page.tsx                      ← Landing / redirect
├── (auth)/
│   ├── login/page.tsx
│   ├── register/page.tsx
│   └── placement/page.tsx        ← Placement Wizard (5-10 câu)
├── (dashboard)/
│   ├── layout.tsx                ← Sidebar + AuthGuard
│   ├── page.tsx                  ← Dashboard chính
│   ├── learn/
│   │   ├── page.tsx              ← Chọn type (reading/listening) + level
│   │   └── [id]/page.tsx         ← Nội dung bài học
│   ├── flashcard/
│   │   ├── page.tsx              ← Chọn bộ từ vựng
│   │   └── study/page.tsx        ← 6 chế độ flashcard
│   ├── quiz/
│   │   ├── page.tsx              ← Chọn source (random/all/custom)
│   │   └── attempt/[id]/page.tsx ← Làm quiz
│   └── vocabulary/
│       └── page.tsx              ← Danh sách từ đã lưu
├── admin/
│   ├── layout.tsx                ← AdminGuard
│   ├── page.tsx                  ← Dashboard admin
│   ├── contents/page.tsx         ← Quản lý content
│   └── users/page.tsx            ← Quản lý user
└── api/                          ← API routes (nếu cần)
```

---

## 7. User Flow Chi Tiết

### 7.1 Onboarding

```
[Đăng ký] → [Chọn ngôn ngữ học (En/Zh/Ja)]
  → [Placement Wizard: 5-10 câu từ dễ→khó]
  → [Hệ thống gợi ý level A0-C2]
  → [User confirm hoặc điều chỉnh]
  → [Vào Dashboard]
```

### 7.2 Học Reading

```
[Dashboard] → [Tạo bài học mới] → [Chọn Reading + level]
  → Backend gọi Gemini sinh (passage + vocab + quiz)
  → Lưu vào contents table (dùng chung cho user khác)
  → Hiển thị bài đọc
  → User click từ bất kỳ → popup nghĩa → lưu vocabulary
  → Đánh dấu ✅ Completed → ghi user_progress
```

### 7.3 Học Listening (Phase 2)

```
[Tạo bài học mới] → [Chọn Listening + level]
  → Backend gọi Gemini sinh (script + vocab + quiz)
  → TTS từ body text (Edge-TTS)
  → User nghe → làm Comprehension MCQ
  → Làm Dictation: câu với blank → gõ từ khóa
  → ✅ Completed
```

### 7.4 Flashcard

```
[Flashcard] → [Chọn bộ từ (tất cả / theo content / theo level)]
  → Chọn 1 trong 6 chế độ:
    1. Classic: từ → nghĩa + ví dụ
    2. Reverse: nghĩa → từ
    3. Audio: nghe → đoán từ
    4. Image: ảnh AI sinh → đoán từ
    5. Sentence Cloze: câu blank → điền từ
    6. Typing: nghĩa → gõ từ
  → User tự ôn, không có lịch ép
```

### 7.5 Quiz Center

```
[Quiz] → [Chọn nguồn: Random | All completed | Custom]
  → Gửi content_ids lên backend
  → Backend gọi Gemini sinh 10-15 câu application-based
  → User làm bài → tự so đáp án
  → Lưu quiz_attempts
```

---

## 8. AI Integration

### 8.1 Prompt Template (Reading)

```
You are a language learning content creator.
Create a {level} {language} reading passage (~300 words) on a suitable topic.

Requirements:
- Level-appropriate vocabulary and grammar
- Natural, engaging content

Return JSON:
{
  "title": "...",
  "body": "...",
  "summary": "2-3 câu tóm tắt",
  "vocabulary": [
    { "word": "...", "ipa": "...", "pos": "...", "definition": "...", "example": "..." }
  ],
  "quiz": [
    { "type": "mcq"|"tf"|"fill_blank", "question": "...", "options": [...], "correct_answer": "..." }
  ]
}
```

### 8.2 Prompt Template (Quiz generation)

```
Based on the following learning materials, generate {count} application-style questions.
Questions should test understanding and ability to apply, not rote memorization.

Materials:
{content_bodies}

Return JSON:
{
  "questions": [
    { "type": "mcq"|"tf"|"fill_blank"|"arrange", "question": "...", "options": [...], "correct_answer": "..." }
  ]
}
```

### 8.3 Error Handling

- Timeout: 30s
- Retry: 1 lần nếu lỗi
- Fallback: thông báo "Không thể tạo nội dung, vui lòng thử lại"
- Log lỗi để debug

---

## 9. Tính năng theo Phase

### Phase 1 (MVP) — English first

| Module | Tính năng |
|---|---|
| Auth | Register, Login, JWT middleware |
| Placement | 5-10 câu hỏi → gợi ý level A0-C2 |
| Reading | AI sinh content → đọc → click tra từ → ✅ Complete |
| Flashcard | 6 chế độ từ user_vocabulary |
| Quiz Center | Chọn source → AI sinh đề → user tự chấm |
| Admin | CRUD content, quản lý user, dashboard cơ bản |

### Phase 2

| Module | Tính năng |
|---|---|
| Listening | TTS + Comprehension MCQ + Dictation |
| Ngôn ngữ | Thêm tiếng Trung (zh) + Nhật (ja) |
| Grammar | Explanation + Example + AI Quiz |

### Phase 3

| Module | Tính năng |
|---|---|
| AI Teacher | Gợi ý nội dung, từ cần ôn, kế hoạch hằng ngày |
| Gamification | XP, Level, Streak, Badge, Achievement, Learning Calendar |
| Notebook | Vocabulary, Sentence, Grammar, Mistake, AI Notes |
| User link | User tự dán link YouTube/bài báo → AI xử lý |

---

## 10. Những thứ đã loại bỏ

| Thứ | Lý do |
|---|---|
| SRS schedule (1/3/7/14/30/90) | Thay bằng Quiz application-based từ content đã học |
| Speaking module | Tốn AI (speech recognition), không phải trọng tâm |
| Writing module | Tốn AI, khó chấm tự động chất lượng cao |
| RBAC / multi-role | Chỉ cần admin + user |
| Multi-provider phức tạp | ~Đã thay bằng API Key Management system~ |
| Lưu nội dung gốc | Chỉ lưu AI output, tránh bản quyền |
| Mở rộng ngôn ngữ tùy ý | Chỉ 3 ngôn ngữ cố định |
| Duyệt nội dung cộng đồng | Phase 3 (nếu có) |

---

## 11. External Services & API Key Management

### 11.1 Danh sách dịch vụ

| Service | Mục đích | Auth method | Cấu hình cần |
|---|---|---|---|
| **Google OAuth** | Đăng nhập user bằng tài khoản Google | OAuth 2.0 | `client_id` + `client_secret` |
| **Facebook OAuth** | Đăng nhập user bằng tài khoản Facebook | OAuth 2.0 | `app_id` + `app_secret` |
| **Gemini API** | AI sinh nội dung bài học (passage, vocab, quiz) | API key, header `x-goog-api-key` | 1 key string |
| **Edge-TTS** | Chuyển text → giọng nói (Listening) | Free, chạy local | Không cần |
| **Cloudinary** | Lưu trữ audio (TTS) + ảnh | API credentials | `cloud_name` + `api_key` + `api_secret` |

### 11.2 Database — API Key Management

```sql
CREATE TABLE api_providers (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        VARCHAR(100) UNIQUE NOT NULL,
  endpoint    VARCHAR(500) NOT NULL,
  is_active   BOOLEAN NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE api_keys (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id     UUID NOT NULL REFERENCES api_providers(id) ON DELETE CASCADE,
  key_value       TEXT NOT NULL,
  key_preview     VARCHAR(20) NOT NULL,
  status          VARCHAR(20) NOT NULL DEFAULT 'active'
                  CHECK (status IN ('active','rate_limited','invalid','error','disabled')),
  error_message   TEXT,
  last_checked_at TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

**Giải thích `key_value`:**
- Gemini: lưu 1 key string duy nhất
- Cloudinary: lưu JSON string `{"cloud_name":"...","api_key":"...","api_secret":"..."}` (parse ở backend)

### 11.3 Seed data mẫu

```sql
INSERT INTO api_providers (name, endpoint) VALUES
  ('gemini to content', 'https://generativelanguage.googleapis.com/v1beta/models'),
  ('gemini to quiz',    'https://generativelanguage.googleapis.com/v1beta/models'),
  ('cloudinary',        'https://api.cloudinary.com/v1_1');
```

### 11.4 Cơ chế tự động

```
AI Generator gọi selectKey('gemini to content')
  → Lấy 1 key bất kỳ status = 'active'
  → Gọi Gemini API
  → Nếu 429 (rate limit):
      → update status = 'rate_limited', error_message = '429 ...'
      → lấy key active khác → thử lại
  → Nếu 403 (invalid key):
      → update status = 'invalid', error_message = '403 ...'
      → lấy key active khác → thử lại
  → Nếu hết key active → trả lỗi "Dịch vụ AI tạm thời gián đoạn"
```

### 11.5 Admin endpoints

| Method | Path | Mô tả |
|---|---|---|
| `GET` | `/admin/api-providers` | List providers |
| `POST` | `/admin/api-providers` | Tạo provider |
| `GET` | `/admin/api-keys?provider_id=xxx` | List keys |
| `POST` | `/admin/api-keys` | Thêm key mới |
| `PATCH` | `/admin/api-keys/:id` | Sửa status, error_message |
| `DELETE` | `/admin/api-keys/:id` | Xoá key |

---

## 12. Admin Sidebar Design (Mega Menu)

Khi admin có nhiều mục (>5), sidebar dùng **mega menu** — click vào nhóm để xổ ra danh sách con. Ví dụ:

```
Dashboard
Providers ▼
  ├── Tất cả
  ├── gemini to content
  ├── gemini to quiz
  └── cloudinary
```

Áp dụng khi số lượng provider > 3. Nếu chỉ 1-2 provider, giữ sidebar 2 tầng đơn giản (Dashboard / Providers).

---

## 13. Rủi ro & Giảm thiểu

| Rủi ro | Giải pháp |
|---|---|
| Chi phí AI tăng khi user đông | Soft-limit 5 bài/ngày/user, cache content trong DB |
| Gemini API lỗi/thay đổi | Abstraction layer cho AI calls, dễ swap provider |
| Chất lượng nội dung AI không ổn định | Validate JSON output, retry khi parse lỗi |
| Người dùng chọn sai level | Placement Wizard gợi ý, có thể đổi lại bất cứ lúc nào |
| Next.js 16 breaking changes | Đọc docs trong node_modules trước khi code |
