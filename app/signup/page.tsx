"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { signUp, sendVerificationEmail, verifyEmail } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Loader2, Mail, CheckCircle } from "lucide-react"

const Signup: React.FC = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    phone: "",
    verificationCode: "",
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [isEmailSent, setIsEmailSent] = useState(false)
  const [isEmailVerified, setIsEmailVerified] = useState(false)
  const [verificationToken, setVerificationToken] = useState("")
  const router = useRouter()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSendVerificationEmail = async () => {
    setLoading(true)
    try {
      await sendVerificationEmail(formData.email)
      setIsEmailSent(true)
      setError("")
    } catch (err) {
      setError("인증 이메일 전송에 실패했습니다. 다시 시도해주세요.")
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyEmail = async () => {
    setLoading(true)
    try {
      const response = await verifyEmail(formData.email, formData.verificationCode)
      setIsEmailVerified(true)
      setVerificationToken(response.token)
      setError("")
    } catch (err) {
      setError("이메일 인증에 실패했습니다. 코드를 확인하고 다시 시도해주세요.")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isEmailVerified) {
      setError("회원가입 전에 이메일을 인증해주세요.")
      return
    }

    setLoading(true)
    try {
      await signUp({
        email: formData.email,
        password: formData.password,
        name: formData.name,
        phone: formData.phone,
        token: verificationToken,
      })
      router.push("/login")
    } catch (err) {
      setError("회원가입에 실패했습니다. 다시 시도해주세요.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">회원가입</CardTitle>
          <CardDescription className="text-center">새 계정을 만들어 쇼핑을 시작하세요</CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Email Verification Section */}
            <div className="space-y-2">
              <Label htmlFor="email">이메일</Label>
              <div className="flex space-x-2">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="이메일을 입력하세요"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  disabled={isEmailVerified || loading}
                />
                {!isEmailVerified && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleSendVerificationEmail}
                    disabled={!formData.email || isEmailSent || loading}
                  >
                    {loading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : isEmailSent ? (
                      <Mail className="h-4 w-4" />
                    ) : (
                      "인증"
                    )}
                  </Button>
                )}
                {isEmailVerified && (
                  <Badge variant="secondary" className="px-3">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    인증완료
                  </Badge>
                )}
              </div>
            </div>

            {isEmailSent && !isEmailVerified && (
              <div className="space-y-2">
                <Label htmlFor="verificationCode">인증 코드</Label>
                <div className="flex space-x-2">
                  <Input
                    id="verificationCode"
                    name="verificationCode"
                    type="text"
                    placeholder="인증 코드를 입력하세요"
                    value={formData.verificationCode}
                    onChange={handleInputChange}
                    required
                    disabled={loading}
                  />
                  <Button type="button" onClick={handleVerifyEmail} disabled={!formData.verificationCode || loading}>
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "확인"}
                  </Button>
                </div>
              </div>
            )}

            {isEmailVerified && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="password">비밀번호</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="비밀번호를 입력하세요"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name">이름</Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="이름을 입력하세요"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">전화번호</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="전화번호를 입력하세요"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    disabled={loading}
                  />
                </div>
              </>
            )}
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            {isEmailVerified && (
              <Button type="submit" className="w-full" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                회원가입
              </Button>
            )}

            <p className="text-sm text-center text-muted-foreground">
              이미 계정이 있으신가요?{" "}
              <Link href="/login" className="text-primary hover:underline">
                로그인
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

export default Signup
