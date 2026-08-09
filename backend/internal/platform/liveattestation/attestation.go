package liveattestation

import (
	"context"
	"errors"
)

var (
	ErrUnsupportedPlatform = errors.New("实时证明仅支持在运行 Gateway Bot 的 macOS 上使用，暂不支持 Windows")
	ErrChatGPTAppMissing   = errors.New("实时证明要求 Gateway Bot 服务器安装官方 ChatGPT 应用")
)

// Provider 在发起 Live 请求前生成 ChatGPT DeviceCheck attestation。
type Provider interface {
	Check(ctx context.Context) error
	Generate(ctx context.Context) (string, error)
}
