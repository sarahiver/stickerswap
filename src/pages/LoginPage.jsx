import { useState } from 'react'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../context/AuthContext'
import Button from '../components/Button'
import Card from '../components/Card'
import { marginStart } from '../theme/rtl'

// ============================================================
// LoginPage — Kapitel 1: Auth
// Google OAuth als Primär-Login (empfohlen)
// E-Mail/Passwort als Fallback
// ============================================================

const Page = styled.div`
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: ${({ theme }) => theme.colors.bg};
`

const Logo = styled.div`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 52px;
  letter-spacing: 0.06em;
  color: ${({ theme }) => theme.colors.accent};
  margin-bottom: 8px;
  span { color: ${({ theme }) => theme.colors.accent2}; }
`

const Tagline = styled.div`
  color: ${({ theme }) => theme.colors.muted};
  font-size: 14px;
  margin-bottom: 40px;
  text-align: center;
`

const LoginCard = styled(Card)`
  width: 100%;
  max-width: 400px;
`

const GoogleBtn = styled(Button)`
  background: #fff;
  color: #333;
  font-weight: 600;
  border: 1.5px solid #e0e0e0;
  gap: 10px;
  &:active { background: #f5f5f5; }
`

const GoogleIcon = styled.span`
  font-size: 20px;
  line-height: 1;
`

const Divider = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 20px 0;
  color: ${({ theme }) => theme.colors.muted};
  font-size: 13px;
  &::before, &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: ${({ theme }) => theme.colors.border};
  }
`

const Input = styled.input`
  width: 100%;
  background: ${({ theme }) => theme.colors.surface2};
  border: 1.5px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  padding: 12px 14px;
  font-size: 15px;
  color: ${({ theme }) => theme.colors.text};
  outline: none;
  transition: border-color 0.15s;
  margin-bottom: 10px;
  /* RTL: text-align passt sich automatisch an via dir-Attribut */
  &:focus { border-color: ${({ theme }) => theme.colors.accent}; }
  &::placeholder { color: ${({ theme }) => theme.colors.muted}; }
`

const ErrorMsg = styled.div`
  background: rgba(232,67,90,0.1);
  border: 1px solid rgba(232,67,90,0.3);
  border-radius: ${({ theme }) => theme.radius.md};
  padding: 10px 14px;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.accent2};
  margin-bottom: 12px;
`

const Footer = styled.div`
  margin-top: 16px;
  text-align: center;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.muted};
`

const Link = styled.button`
  color: ${({ theme }) => theme.colors.accent};
  font-size: 13px;
  ${marginStart('4px')}
  min-height: auto;
  &:hover { text-decoration: underline; }
`

// ── Component ─────────────────────────────────────────────────

const LoginPage = ({ onSwitchToRegister }) => {
  const { t }                     = useTranslation()
  const { loginWithGoogle, loginWithEmail, error } = useAuth()

  const [mode,     setMode]     = useState('login')  // 'login' | 'register'
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [loading,  setLoading]  = useState(false)
  const [localErr, setLocalErr] = useState('')

  const handleEmailLogin = async () => {
    setLocalErr('')
    if (!email || !password) { setLocalErr('Bitte E-Mail und Passwort eingeben.'); return }
    setLoading(true)
    const result = await loginWithEmail(email, password)
    setLoading(false)
    if (!result.success) setLocalErr(result.error)
  }

  const displayError = localErr || error

  return (
    <Page>
      <Logo>Sticker<span>Swap</span></Logo>
      <Tagline>{t('app.tagline')}</Tagline>

      <LoginCard>
        {/* Google OAuth — Primär */}
        <GoogleBtn
          $variant="secondary"
          $full
          onClick={loginWithGoogle}
        >
          <GoogleIcon>🔵</GoogleIcon>
          {t('auth.loginWithGoogle')}
        </GoogleBtn>

        <Divider>oder</Divider>

        {/* E-Mail/Passwort — Sekundär */}
        {displayError && <ErrorMsg>{displayError}</ErrorMsg>}

        <Input
          type="email"
          placeholder={t('auth.email')}
          value={email}
          onChange={e => setEmail(e.target.value)}
          autoComplete="email"
          dir="ltr"  /* E-Mail immer LTR */
        />
        <Input
          type="password"
          placeholder={t('auth.password')}
          value={password}
          onChange={e => setPassword(e.target.value)}
          autoComplete="current-password"
          dir="ltr"
        />

        <Button
          $variant="primary"
          $full
          onClick={handleEmailLogin}
          disabled={loading}
        >
          {loading ? t('common.loading') : t('auth.login')}
        </Button>

        <Footer>
          {t('auth.noAccountYet')}
          <Link onClick={onSwitchToRegister}>{t('auth.register')}</Link>
        </Footer>
      </LoginCard>
    </Page>
  )
}

export default LoginPage
