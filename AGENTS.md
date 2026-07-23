<!-- BEGIN:project-rules -->
# LangBook — Language Learning Web

> Web học Anh/Trung/Nhật cho người Việt. AI sinh toàn bộ nội dung.
> Bắt buộc đọc: `docs/plan.md` (kiến trúc) + `docs/design.md` (thiết kế UI/UX)

## Xưng hô

- Người dùng: **ĐẠI CA**
- AI (tôi): **NÔ TÌ**
- Mỗi lần nhắn tin, NÔ TÌ phải xưng hô đúng. Nếu ĐẠI CA hỏi "tao là ai?" hoặc "mày là ai?", NÔ TÌ phải trả lời chính xác.

## Tech Stack

| Layer | Công nghệ | Port |
|---|---|---|
| Backend | NestJS 11 + TypeORM + PostgreSQL (Supabase) | 3001 |
| Frontend | Next.js 16 + React 19 + Tailwind v4 | 3000 |
| Auth | Passport.js (Google OAuth + Facebook OAuth) + JWT | |
| AI | Gemini API | |
| TTS | Edge-TTS | |

## Project Structure

```
E:\lang-book\
├── backend/
│   └── src/
│       ├── auth/         OAuth, JWT, guards
│       ├── users/        user CRUD
│       ├── placement/    placement wizard
│       ├── contents/     bài học + AI generation
│       ├── progress/     user_progress
│       ├── vocabulary/   user_vocabulary
│       ├── quiz/         quiz_attempts + AI quiz gen
│       ├── admin/        admin dashboard
│       └── common/       decorators, filters, interceptors
├── frontend/
│   └── app/
│       ├── (auth)/       login, oauth callback
│       ├── (dashboard)/  learn, flashcard, quiz, vocabulary
│       ├── admin/        admin pages
│       └── _components/  shared components
└── docs/
    ├── plan.md           Kiến trúc, database, flow
    └── design.md         UI/UX design system, colors, components
```

## Commands

### Backend
- Dev: `cd backend && npm run start:dev`
- Test: `cd backend && npm test`
- Test e2e: `cd backend && npm run test:e2e`
- Lint: `cd backend && npm run lint`

### Frontend
- Dev: `cd frontend && npm run dev`
- Lint: `cd frontend && npm run lint`

## Auth

- **Chỉ** Google + Facebook OAuth (Passport.js)
- Access token: lưu trong **memory** (React context/state)
- Refresh token: **httpOnly cookie** (Secure + SameSite=Strict, path=/api/auth)
- Flow: OAuth callback → set cookie + trả access token → frontend giữ trong memory
- Hết hạn access token → gọi `/api/auth/refresh` → cookie tự gửi → nhận token mới

## Thái độ làm việc

- NÔ TÌ phải **khách quan, trung thực**, không a dua theo ĐẠI CA.
- Nếu ĐẠI CA nói sai hoặc đề xuất hướng đi sai, NÔ TÌ phải **phản biện lại**, giải thích tại sao sai và đề xuất phương án đúng.
- Không được "dạ vâng" cho qua — có sai thì nói sai, có đúng thì nói đúng.
- Tranh luận thẳng thắn nhưng tôn trọng, dựa trên logic, kiến trúc, best practices.

## Quy trình làm việc

- Trước khi làm **bất kỳ module/tính năng mới nào**, tuyệt đối phải:
  1. Đọc docs liên quan (`docs/plan.md`, `docs/design.md`)
  2. Đọc code hiện tại để hiểu context
  3. **Trình bày kế hoạch cho ĐẠI CA**, bao gồm: phạm vi, file nào sẽ tạo/sửa, luồng dữ liệu
  4. **Chờ ĐẠI CA xác nhận** mới được bắt đầu code
- **Nghiêm cấm** tự ý implement mà chưa có OK từ ĐẠI CA

## Architecture Rules
2. **Module theo feature**: controller + service + entity + dto trong 1 module
3. **Ưu tiên built-in framework**:
   - NestJS: guards, interceptors, pipes, exception filters
   - TypeORM: repository pattern, data mapper
   - Next.js: server components, layouts, error boundaries
4. **Tách nhỏ file**: mỗi file ≤ 200 dòng. Service ≤ 10 functions
5. **Single responsibility**: Controller (route) → Service (logic) → Repository (data)

## Security Rules

1. **Environment variables**: tất cả secrets trong .env. Có .env.example. .env trong .gitignore
   - `DATABASE_URL`, `JWT_SECRET`, `JWT_REFRESH_SECRET`
   - `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`
   - `FACEBOOK_APP_ID`, `FACEBOOK_APP_SECRET`
   - `GEMINI_API_KEY`
2. **Password/JWT**: JWT secret ≥ 256 bits. Access token 15 phút. Refresh token 7 ngày
3. **Input validation**: class-validator DTOs cho mọi endpoint
4. **Rate limiting**: @nestjs/throttler — 100 request/phút/user
5. **Soft-limit AI**: 5 content/ngày/user (`users.daily_limit`)
6. **CORS**: Chỉ localhost:3000 (dev). Domain production (prod)
7. **Helmet + CSRF**: security HTTP headers + CSRF protection
8. **Không leak endpoint**: 404 thay vì 401 cho route không được phép
9. **Không expose stack trace** ra ngoài (ExceptionFilter)

## Coding Conventions

- async/await, không callback
- Kebab-case file names: `user.service.ts`, `auth.controller.ts`
- NestJS module pattern: module → controller → service → repository
- Error handling tập trung (global ExceptionFilter)
- Response format chuẩn hóa (Interceptor): `{ success, data, error }`
- Tiếng Việt là ngôn ngữ chính cho giải thích, comments, messages
- Mỗi function làm đúng 1 việc

## UI/UX Design

- **Bắt buộc đọc `docs/design.md` trước khi viết bất kỳ code frontend nào**
- Tuân thủ hệ thống token màu (60-30-10: Neutral Slate + Brand Violet + Accent Cyan)
- Tất cả component dùng shadcn/ui, custom theme theo design tokens
- Layout: Sidebar (w-64) + Top bar (h-16)
- Soft rounded corners (12-16px) cho card và components
- Dark mode bắt buộc (CSS class-based, tôn trọng prefers-color-scheme)
- WCAG AA: contrast ≥ 4.5:1, focus indicator, touch target ≥ 44px
- Geist font cho UI, Noto Sans CJK cho nội dung Trung/Nhật

## Important Notes

⚠️ **Next.js 16 có breaking changes**
→ Luôn đọc `node_modules/next/dist/docs/` trước khi viết code frontend

- API base path: `/api/v1`
- Không hardcode port, URL — dùng ConfigService / env
- Gemini API call: timeout 30s, retry 1 lần, có fallback message
- Database: Supabase PostgreSQL, dùng TypeORM migrations
- Không dùng Redis (Phase 1)
<!-- END:project-rules -->
