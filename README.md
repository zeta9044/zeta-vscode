# Zeta VS Code Extension

Zeta는 VS Code에서 Claude Code 스타일의 터미널 모드를 제공하는 확장 프로그램으로, AI 호출은 외부 API로 분리해 처리합니다. 확장은 안전한 API 설정, 전용 AI 터미널 열기, 모델로 명령을 전달하는 단순한 흐름에 집중합니다.

## 주요 기능
- **AI 터미널 세션**: AI 상호작용 전용 VS Code 터미널 탭을 엽니다.
- **명령 실행기**: 자유 형식의 지시문을 외부 AI 엔드포인트로 보내고 응답을 터미널에 스트리밍합니다.
- **엔드포인트·모델 설정**: VS Code 설정에서 API 기본 URL, API 키, 모델 이름을 지정합니다.
- **Diff UX 지향**: AI가 제안한 변경을 Diff 프리뷰로 보여주고 사용자가 Apply/Reject/Regenerate를 선택하는 흐름을 목표로 합니다.

## 시작하기
1. 의존성 설치
   ```bash
   npm install
   ```
2. 확장 빌드
   ```bash
   npm run compile
   ```
3. VS Code에서 `F5`를 눌러 Extension Development Host를 띄우고 다음 명령을 실행해 보세요.
   - `Zeta: Open AI Terminal Session`
   - `Zeta: Send Instruction to AI`

## 설정 항목
- `zeta.apiBaseUrl`: 외부 AI API의 기본 URL.
- `zeta.apiKey`: 인증 세션이 없을 때 사용할 API 키.
- `zeta.model`: 각 지시문에 함께 보낼 모델 식별자.

## 개발 메모
- 명령 정의는 `package.json`, 구현은 `src/extension.ts`에 있습니다.
- 현재는 설정된 API의 `POST /instructions`로 요청을 보냅니다. 백엔드 계약이 확정되면 페이로드 형식을 조정하세요.
- Claude Code 스타일 Diff UX 원칙과 터미널 모드 고려사항은 `docs/diff-ux.md`에 정리되어 있습니다.

## 라이선스
이 프로젝트는 GNU General Public License v3.0을 따릅니다. 자세한 내용은 [LICENSE](LICENSE)를 참고하세요.
