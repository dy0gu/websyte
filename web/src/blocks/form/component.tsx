'use client'
import type { FormFieldBlock, Form as FormType } from '@payloadcms/plugin-form-builder/types'
import type { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'
import { useTranslations } from 'next-intl'
import type React from 'react'
import { useCallback, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import RichText from '@/components/rich-text'
import { Button } from '@/components/ui/button'
import { useRouter } from '@/i18n/navigation'
import shared from '@/styles/shared.module.css'
import { getClientSideURL } from '@/utilities/get-url'
import { cn } from '@/utilities/ui'
import { fields } from './fields'
import styles from './form.module.css'

export type FormBlockType = {
  blockName?: string
  blockType?: 'formBlock'
  enableIntro: boolean
  form: FormType
  introContent?: DefaultTypedEditorState
}

export const FormBlock: React.FC<
  {
    className?: string
    id?: string
  } & FormBlockType
> = (props) => {
  const {
    className,
    enableIntro,
    form: formFromProps,
    form: { id: formID, confirmationMessage, confirmationType, redirect, submitButtonLabel } = {},
    introContent,
  } = props

  const t = useTranslations('UI')
  const formMethods = useForm({
    defaultValues: formFromProps.fields,
  })
  const {
    control,
    formState: { errors },
    handleSubmit,
    register,
  } = formMethods

  const [isLoading, setIsLoading] = useState(false)
  const [hasSubmitted, setHasSubmitted] = useState<boolean>()
  const [error, setError] = useState<{ message: string; status?: string } | undefined>()
  const router = useRouter()

  const onSubmit = useCallback(
    (data: FormFieldBlock[]) => {
      let loadingTimerID: ReturnType<typeof setTimeout>
      const submitForm = async () => {
        setError(undefined)

        const dataToSend = Object.entries(data).map(([name, value]) => ({
          field: name,
          value,
        }))

        // delay loading indicator by 1s
        loadingTimerID = setTimeout(() => {
          setIsLoading(true)
        }, 1000)

        try {
          const req = await fetch(`${getClientSideURL()}/api/form-submissions`, {
            body: JSON.stringify({
              form: formID,
              submissionData: dataToSend,
            }),
            headers: {
              'Content-Type': 'application/json',
            },
            method: 'POST',
          })

          const res = await req.json()

          clearTimeout(loadingTimerID)

          if (req.status >= 400) {
            setIsLoading(false)

            setError({
              message: t('submitError'),
              status: res.status,
            })

            return
          }

          setIsLoading(false)
          setHasSubmitted(true)

          if (confirmationType === 'redirect' && redirect) {
            const { url } = redirect

            const redirectUrl = url

            if (redirectUrl) router.push(redirectUrl)
          }
        } catch (err) {
          console.warn(err)
          setIsLoading(false)
          setError({
            message: t('submitError'),
          })
        }
      }

      void submitForm()
    },
    [router, formID, redirect, confirmationType, t],
  )

  return (
    <div className={cn(shared.container, styles.root, className)}>
      {enableIntro && introContent && !hasSubmitted && (
        <RichText className={styles.intro} data={introContent} enableGutter={false} />
      )}
      <div className={styles.panel}>
        <FormProvider {...formMethods}>
          {!isLoading && hasSubmitted && confirmationType === 'message' && (
            <RichText data={confirmationMessage} />
          )}
          {isLoading && !hasSubmitted && <p>{t('loading')}</p>}
          {error && <div>{`${error.status || '500'}: ${error.message || ''}`}</div>}
          {!hasSubmitted && (
            <form id={formID} onSubmit={handleSubmit(onSubmit)}>
              <div className={styles.fields}>
                {formFromProps?.fields?.map((field) => {
                  // biome-ignore lint/suspicious/noExplicitAny: field components accept heterogeneous generated props
                  const Field: React.FC<any> = fields?.[field.blockType as keyof typeof fields]
                  if (Field) {
                    const fieldKey =
                      'name' in field ? field.name : field.blockName || field.blockType
                    return (
                      <div className={styles.field} key={fieldKey}>
                        <Field
                          form={formFromProps}
                          {...field}
                          {...formMethods}
                          control={control}
                          errors={errors}
                          register={register}
                        />
                      </div>
                    )
                  }
                  return null
                })}
              </div>

              <Button form={formID} type="submit">
                {submitButtonLabel}
              </Button>
            </form>
          )}
        </FormProvider>
      </div>
    </div>
  )
}
