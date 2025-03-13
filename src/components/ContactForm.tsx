'use client'

import { useForm } from '@tanstack/react-form'
import { z } from 'zod'
import type { AnyFieldApi } from '@tanstack/react-form'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Textarea } from './ui/textarea'
import { Form } from '@/payload-types'
import { useState } from 'react'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { useRouter } from 'next/navigation'

function FieldInfo({ field }: { field: AnyFieldApi }) {
  return (
    <>
      {field.state.meta.isTouched && field.state.meta.errors.length ? (
        <em className="text-destructive">
          {field.state.meta.errors.map((err) => err.message).join(',')}
        </em>
      ) : null}
      {field.state.meta.isValidating ? 'Validating...' : null}
    </>
  )
}

const contactFormSchema = z.object({
  name: z.string().min(2, 'You must have a length of at least 2'),
  email: z.string().email(),
  message: z.string().min(2, 'You must have a length of at least 2'),
})

export type ContactFormData = z.infer<typeof contactFormSchema>

export function ContactForm({ formConfig }: { formConfig: Form }) {
  const [postError, setPostError] = useState<{ message: string; status?: string } | undefined>()
  const [hasSubmitted, setHasSubmitted] = useState<boolean>(false)
  const router = useRouter()

  const { redirect, confirmationType, confirmationMessage } = formConfig

  const form = useForm({
    defaultValues: {
      name: '',
      email: '',
      message: '',
    },
    onSubmit: async ({ value }) => {
      setPostError(undefined)
      try {
        const req = await fetch('http://localhost:3000/api/form-submissions', {
          body: JSON.stringify({
            formType: formConfig.type,
            title: value.email,
            submissionData: value,
          }),
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'POST',
        })
        const res = await req.json()

        if (req.status >= 400) {
          setPostError({
            message: res.errors?.[0]?.message || 'Internal Server Error',
            status: req.status.toString(),
          })
        }

        setHasSubmitted(true)
        form.reset()

        if (confirmationType === 'redirect' && redirect?.url) {
          router.push(redirect.url)
        }
      } catch (error) {
        setPostError({
          message: 'Something went wrong',
          status: '500',
        })
      }
    },
    validators: {
      onChange: contactFormSchema,
    },
  })

  return (
    <>
      {postError && (
        <em className="text-destructive">{`${postError.status || '500'}: ${postError?.message || ''}`}</em>
      )}
      {!hasSubmitted || confirmationType !== 'message' ? (
        <Card className="min-w-md">
          <CardHeader>
            <CardTitle>Contact Form</CardTitle>
          </CardHeader>
          <CardContent>
            <form
              className="space-y-3"
              onSubmit={(e) => {
                e.preventDefault()
                e.stopPropagation()
                form.handleSubmit()
              }}
            >
              <div>
                <form.Field name="name">
                  {(field) => {
                    return (
                      <>
                        <Label htmlFor={field.name} className="mb-1">
                          Name:
                        </Label>
                        <Input
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                        />
                        <FieldInfo field={field} />
                      </>
                    )
                  }}
                </form.Field>
              </div>
              <div>
                <form.Field name="email">
                  {(field) => (
                    <>
                      <Label htmlFor={field.name} className="mb-1">
                        Email:
                      </Label>
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                      <FieldInfo field={field} />
                    </>
                  )}
                </form.Field>
              </div>
              <div>
                <form.Field name="message">
                  {(field) => (
                    <>
                      <Label htmlFor={field.name} className="mb-1">
                        Message:
                      </Label>
                      <Textarea
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                      <FieldInfo field={field} />
                    </>
                  )}
                </form.Field>
              </div>

              <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
                {([canSubmit, isSubmitting]) => (
                  <Button type="submit" disabled={!canSubmit}>
                    {isSubmitting ? '...' : 'Submit'}
                  </Button>
                )}
              </form.Subscribe>
            </form>
          </CardContent>
        </Card>
      ) : confirmationMessage ? (
        <RichText data={confirmationMessage} />
      ) : null}
    </>
  )
}
