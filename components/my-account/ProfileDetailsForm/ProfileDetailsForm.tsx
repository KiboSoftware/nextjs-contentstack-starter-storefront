import React, { useEffect, useState } from 'react'

import { yupResolver } from '@hookform/resolvers/yup'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import { styled, FormControl, Box, Stack, Button } from '@mui/material'
import { useTranslation } from 'next-i18next'
import { useForm, Controller } from 'react-hook-form'
import * as yup from 'yup'

import { PasswordValidation } from '@/components/common'
import KiboTextBox from '@/components/common/KiboTextBox/KiboTextBox'
import { ProfileDetails, UpdateProfileDataParam } from '@/lib/types'

type PasswordFieldType = 'currentPassword' | 'newPassword' | 'confirmPassword'

export interface ProfileDetailsFormProps extends ProfileDetails {
  isEmailForm?: boolean
  isPasswordForm?: boolean
  onSaveProfileData: <T extends UpdateProfileDataParam>(profileData: T) => void
  onCancel: () => void
}

const StyledCardDiv = styled('div')(() => ({
  paddingLeft: '0.5rem',
}))

const useCardSchema = () => {
  const { t } = useTranslation('checkout')
  return yup.object({
    firstName: yup.string().when(['$isEmailForm', '$isPasswordForm'], {
      is: (isEmailForm: boolean, isPasswordForm: boolean) => !isEmailForm && !isPasswordForm,
      then: yup.string().required(t('this-field-is-required')),
    }),
    lastName: yup.string().when(['$isEmailForm', '$isPasswordForm'], {
      is: (isEmailForm: boolean, isPasswordForm: boolean) => !isEmailForm && !isPasswordForm,
      then: yup.string().required(t('this-field-is-required')),
    }),
    emailAddress: yup.string().when('$isEmailForm', (isEmailForm, schema) => {
      if (isEmailForm) {
        return schema.required(t('this-field-is-required'))
      }
    }),
    currentPassword: yup.string().when('$isPasswordForm', (isPasswordForm, schema) => {
      if (isPasswordForm) {
        return schema.required(t('this-field-is-required'))
      }
    }),
    newPassword: yup.string().when('$isPasswordForm', (isPasswordForm, schema) => {
      if (isPasswordForm) {
        return schema
          .required(t('this-field-is-required'))
          .min(8, "Password length doesn't match")
          .matches(/\d/g, 'Password should contain at least one number')
          .matches(/(?=.*[A-Z])/g, 'Password should contain at least one capital letter')
          .matches(/[!@#$%^&*]/g, 'Password should contain at least special character')
      }
    }),
    confirmPassword: yup.string().when('$isPasswordForm', (isPasswordForm, schema) => {
      if (isPasswordForm) {
        return schema
          .required(t('this-field-is-required'))
          .oneOf([yup.ref('newPassword')], "Passwords don't match!")
      }
    }),
  })
}

const ProfileDetailsForm = (props: ProfileDetailsFormProps) => {
  const {
    firstName,
    lastName,
    emailAddress,
    isEmailForm = false,
    isPasswordForm = false,
    onSaveProfileData,
    onCancel,
  } = props
  const { t } = useTranslation('checkout')
  const cardSchema = useCardSchema()
  const [showPassword, setShowPassword] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  })

  const getDefaultValues = () => {
    if (isEmailForm) {
      return { emailAddress }
    }

    if (isPasswordForm) {
      return {
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      }
    }

    if (firstName && lastName) {
      return { firstName, lastName }
    }
    return
  }

  const {
    formState: { errors, isValid, isDirty },
    watch,
    control,
    trigger,
    handleSubmit,
  } = useForm({
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: getDefaultValues(),
    criteriaMode: 'all',
    resolver: yupResolver(cardSchema),
    shouldFocusError: true,
    context: { isEmailForm, isPasswordForm },
  })
  const userEnteredPassword = watch('newPassword')

  const buildParam = (formData: ProfileDetails) => {
    if (formData.emailAddress) {
      return { emailAddress: formData.emailAddress as string }
    }

    if (formData.firstName && formData.lastName) {
      return {
        firstName: formData.firstName as string,
        lastName: formData.lastName as string,
      }
    }

    return {
      oldPassword: formData.currentPassword as string,
      newPassword: formData.newPassword as string,
    }
  }

  const onValid = (formData: ProfileDetails) => onSaveProfileData(buildParam(formData))

  const handleClickShowPassword = (type: PasswordFieldType) => {
    setShowPassword({
      ...showPassword,
      [type]: !showPassword[type],
    })
  }

  useEffect(() => {
    trigger('confirmPassword')
  }, [userEnteredPassword, trigger])

  return (
    <form>
      <StyledCardDiv data-testid="profile-details">
        <FormControl sx={{ width: '100%' }}>
          {isEmailForm && (
            <Controller
              name="emailAddress"
              control={control}
              defaultValue={emailAddress}
              render={({ field }) => (
                <KiboTextBox
                  type="email"
                  value={field.value || ''}
                  label={t('email')}
                  required={true}
                  onChange={(_name, value) => field.onChange(value)}
                  onBlur={field.onBlur}
                  error={!!errors?.emailAddress}
                  helperText={errors?.emailAddress?.message as string}
                />
              )}
            />
          )}

          {isPasswordForm && (
            <>
              <Controller
                name="currentPassword"
                control={control}
                render={({ field }) => (
                  <KiboTextBox
                    value={field.value}
                    label={t('current-password')}
                    required
                    onBlur={field.onBlur}
                    onChange={(_name, value) => field.onChange(value)}
                    error={!!errors.currentPassword}
                    helperText={errors?.currentPassword?.message as string}
                    type={showPassword.currentPassword ? 'text' : 'password'}
                    icon={showPassword.currentPassword ? <Visibility /> : <VisibilityOff />}
                    onIconClick={() => handleClickShowPassword('currentPassword')}
                  />
                )}
              />

              <Controller
                name="newPassword"
                control={control}
                render={({ field }) => (
                  <KiboTextBox
                    value={field.value}
                    label={t('new-password')}
                    required
                    onBlur={field.onBlur}
                    onChange={(_name, value) => field.onChange(value)}
                    error={!!errors.newPassword}
                    helperText={errors?.newPassword?.message as string}
                    placeholder={t('must-be-at-least-8-characters')}
                    type={showPassword.newPassword ? 'text' : 'password'}
                    icon={showPassword.newPassword ? <Visibility /> : <VisibilityOff />}
                    onIconClick={() => handleClickShowPassword('newPassword')}
                  />
                )}
              />

              <Controller
                name="confirmPassword"
                control={control}
                render={({ field }) => (
                  <KiboTextBox
                    value={field.value}
                    label={t('confirm-password')}
                    required
                    onBlur={field.onBlur}
                    onChange={(_name, value) => field.onChange(value)}
                    error={!!errors.confirmPassword}
                    helperText={errors?.confirmPassword?.message as string}
                    type={showPassword.confirmPassword ? 'text' : 'password'}
                    icon={showPassword.confirmPassword ? <Visibility /> : <VisibilityOff />}
                    onIconClick={() => handleClickShowPassword('confirmPassword')}
                  />
                )}
              />
              <Box sx={{ paddingBlock: 2 }}>
                <PasswordValidation password={userEnteredPassword as string} />
              </Box>
            </>
          )}

          {!isEmailForm && !isPasswordForm && (
            <>
              <Controller
                name="firstName"
                control={control}
                defaultValue={firstName}
                render={({ field }) => (
                  <KiboTextBox
                    value={field.value || ''}
                    label={t('first-name')}
                    required={true}
                    onChange={(_name, value) => field.onChange(value)}
                    onBlur={field.onBlur}
                    error={!!errors?.firstName}
                    helperText={errors?.firstName?.message as string}
                  />
                )}
              />
              <Controller
                name="lastName"
                control={control}
                defaultValue={lastName}
                render={({ field }) => (
                  <KiboTextBox
                    value={field.value || ''}
                    label={t('last-name-or-sur-name')}
                    required={true}
                    onChange={(_name, value) => field.onChange(value)}
                    onBlur={field.onBlur}
                    error={!!errors?.lastName}
                    helperText={errors?.lastName?.message as string}
                  />
                )}
              />
            </>
          )}

          <Stack gap={2} sx={{ width: { xs: '100%', md: '50%' } }}>
            <Button variant="contained" color="secondary" onClick={onCancel}>
              {t('common:cancel')}
            </Button>
            <Button
              variant="contained"
              color="primary"
              {...((!isValid || !isDirty) && { disabled: true })}
              onClick={() => handleSubmit(onValid)()}
            >
              {t('common:save')}
            </Button>
          </Stack>
        </FormControl>
      </StyledCardDiv>
    </form>
  )
}

export default ProfileDetailsForm
