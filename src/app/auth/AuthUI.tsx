'use client'

import { useState } from 'react'
import { login, signup } from './actions'
import { Eye } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'

function SubmitButton({
  isLogin,
  pending,
  canSubmit,
}: {
  isLogin: boolean
  pending: boolean
  canSubmit: boolean
}) {
  return (
    <button
      type="submit"
      className="w-full py-3.5 bg-[#7b61ff] hover:bg-[#6a50e5] text-white rounded-xl text-[14px] font-semibold transition-colors mt-4 shadow-lg shadow-[#7b61ff]/20 disabled:opacity-50 disabled:cursor-not-allowed"
      disabled={!canSubmit || pending}
    >
      {pending
        ? isLogin
          ? 'Logging in...'
          : 'Creating account...'
        : isLogin
        ? 'Log in'
        : 'Create account'}
    </button>
  )
}

export default function AuthUI({ error }: { error?: string }) {
  const [isLogin, setIsLogin] = useState(true)
  const [pending, setPending] = useState(false)
  const [emailChecked, setEmailChecked] = useState(false)
  const [emailAvailable, setEmailAvailable] = useState(false)
  const [checking, setChecking] = useState(false)

  async function checkEmailDuplication() {
    const emailEl = document.getElementById('email') as HTMLInputElement | null
    const email = emailEl?.value.trim() ?? ''
    if (!email) return
    setChecking(true)
    const supabase = createClient()
    try {
      const { data } = await (supabase as any)
        .from('users')
        .select('id')
        .eq('email', email)
        .single()
      setEmailAvailable(!data)
    } catch (err: any) {
      // PGRST116 = no rows found → email is free
      if (err?.code === 'PGRST116') {
        setEmailAvailable(true)
      } else {
        setEmailAvailable(false)
      }
    } finally {
      setChecking(false)
      setEmailChecked(true)
    }
  }

  async function handleAction(formData: FormData) {
    setPending(true)
    if (isLogin) {
      await login(formData)
    } else {
      await signup(formData)
    }
    setPending(false)
  }

  const canSubmit = !pending && (isLogin || (emailChecked && emailAvailable))

  return (
    <div className="w-full">
      <h2 className="text-3xl font-semibold text-white mb-2">
        {isLogin ? 'Welcome back' : 'Create an account'}
      </h2>
      <p className="text-[13px] text-white/50 mb-8">
        {isLogin ? "Don't have an account? " : 'Already have an account? '}
        <button
          type="button"
          onClick={() => {
            setIsLogin(!isLogin)
            setEmailChecked(false)
            setEmailAvailable(false)
          }}
          className="text-[#7b61ff] hover:underline underline-offset-4 transition-all"
        >
          {isLogin ? 'Sign up' : 'Log in'}
        </button>
      </p>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-[13px] p-3 rounded-xl mb-6 font-medium">
          {error}
        </div>
      )}

      <form action={handleAction} className="space-y-4">
        {!isLogin && (
          <div className="flex gap-4">
            <div className="flex-1">
              <input
                name="firstName"
                type="text"
                placeholder="First name"
                className="w-full bg-[#2a2932] border border-transparent focus:border-[#7b61ff] rounded-xl px-4 py-3.5 text-[14px] text-white placeholder-white/30 focus:outline-none transition-all"
              />
            </div>
            <div className="flex-1">
              <input
                name="lastName"
                type="text"
                placeholder="Last name"
                className="w-full bg-[#2a2932] border border-transparent focus:border-[#7b61ff] rounded-xl px-4 py-3.5 text-[14px] text-white placeholder-white/30 focus:outline-none transition-all"
              />
            </div>
          </div>
        )}

        <div className="flex gap-2">
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="Email"
            onChange={() => setEmailChecked(false)}
            className="flex-1 bg-[#2a2932] border border-transparent focus:border-[#7b61ff] rounded-xl px-4 py-3.5 text-[14px] text-white placeholder-white/30 focus:outline-none transition-all"
          />
          {!isLogin && (
            <button
              type="button"
              onClick={checkEmailDuplication}
              disabled={checking}
              className="px-4 py-3.5 bg-[#2a2932] text-white text-[13px] rounded-xl hover:bg-[#3a3942] transition-colors disabled:opacity-50"
            >
              {checking ? '...' : 'Check'}
            </button>
          )}
        </div>

        {!isLogin && emailChecked && (
          <p className={`text-[12px] ${emailAvailable ? 'text-green-400' : 'text-red-400'}`}>
            {emailAvailable ? '✓ Email is available' : '✗ Email is already taken'}
          </p>
        )}

        <div className="relative">
          <input
            id="password"
            name="password"
            type="password"
            required
            placeholder={isLogin ? 'Enter your password' : 'Create a password'}
            className="w-full bg-[#2a2932] border border-transparent focus:border-[#7b61ff] rounded-xl px-4 py-3.5 text-[14px] text-white placeholder-white/30 focus:outline-none transition-all pr-12"
          />
          <button
            type="button"
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>

        {!isLogin && (
          <div className="flex items-start gap-3 mt-2">
            <input
              type="checkbox"
              id="terms"
              required
              className="mt-1 w-4 h-4 rounded-sm bg-[#2a2932] border-none text-[#7b61ff] focus:ring-[#7b61ff] focus:ring-offset-0"
            />
            <label htmlFor="terms" className="text-[12px] text-white/50 leading-tight">
              I agree to the{' '}
              <a href="#" className="underline">
                Terms &amp; Conditions
              </a>
            </label>
          </div>
        )}

        <SubmitButton isLogin={isLogin} pending={pending} canSubmit={canSubmit} />

        <div className="relative flex items-center py-4 mt-2">
          <div className="flex-grow border-t border-white/5" />
          <span className="flex-shrink-0 mx-4 text-[11px] text-white/30 uppercase tracking-wider">
            Or continue with
          </span>
          <div className="flex-grow border-t border-white/5" />
        </div>

        <div className="flex gap-4">
          <button
            type="button"
            className="flex-1 bg-transparent border border-white/10 hover:bg-white/5 rounded-xl py-3 flex justify-center items-center gap-2 transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            <span className="text-[13px] font-medium text-white/80">Google</span>
          </button>
          <button
            type="button"
            className="flex-1 bg-transparent border border-white/10 hover:bg-white/5 rounded-xl py-3 flex justify-center items-center gap-2 transition-colors"
          >
            <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.04 2.26-.85 3.5-1.06 1.48-.11 2.83.47 3.58 1.49-3.08 1.76-2.58 5.64.44 6.84-1.12 3.16-3.23 6.01-6.1 4.9zM12.03 7.25C11.83 3.82 14.82 1 17.65 1c.21 3.66-3.4 6.47-5.62 6.25z" />
            </svg>
            <span className="text-[13px] font-medium text-white/80">Apple</span>
          </button>
        </div>
      </form>
    </div>
  )
}
