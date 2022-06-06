import { Modal, Box, Grid, IconButton } from '@mui/material'
import { styled } from '@mui/material/styles'
import GenericForm from 'components/common/form/GenericForm'
import SubmitButton from 'components/common/form/SubmitButton'
import FormTextField from 'components/common/form/FormTextField'
import { Person, UpdateUserAccount, UpdatePerson } from 'gql/person'
import { useMutation } from 'react-query'
import { AxiosError, AxiosResponse } from 'axios'
import { ApiErrors } from 'service/apiErrors'
import { updateCurrentPerson } from 'common/util/useCurrentPerson'
import { AlertStore } from 'stores/AlertStore'
import { useTranslation } from 'next-i18next'
import CloseIcon from '@mui/icons-material/Close'
import { signIn } from 'next-auth/react'
import PasswordField from 'components/common/form/PasswordField'
import { customValidators, name } from 'common/form/validation'
import * as yup from 'yup'

const PREFIX = 'UpdateNameModal'

const classes = {
  modal: `${PREFIX}-modal`,
  close: `${PREFIX}-close`,
}

const StyledModal = styled(Modal)({
  [`& .${classes.modal}`]: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 650,
    backgroundColor: '#EEEEEE',
    padding: 20,
  },
  [`& .${classes.close}`]: {
    position: 'absolute',
    right: '10px',
  },
})

const validationSchema: yup.SchemaOf<
  Pick<UpdateUserAccount, 'firstName' | 'lastName' | 'password'>
> = yup
  .object()
  .defined()
  .shape({
    firstName: name.required(),
    lastName: name.required(),
    password: yup.string().min(6, customValidators.passwordMin).required(),
  })

function UpdateNameModal({
  isOpen,
  handleClose,
  person,
}: {
  isOpen: boolean
  handleClose: (data?: Person) => void
  person: UpdatePerson
}) {
  const { t } = useTranslation()

  const mutation = useMutation<AxiosResponse<Person>, AxiosError<ApiErrors>, UpdatePerson>({
    mutationFn: updateCurrentPerson(),
    onError: () => AlertStore.show(t('common:alerts.error'), 'error'),
    onSuccess: () => {
      AlertStore.show(t('common:alerts.success'), 'success')
    },
  })

  const onSubmit = async (
    values: Pick<UpdateUserAccount, 'firstName' | 'lastName' | 'password'>,
  ) => {
    try {
      const confirmPassword = await signIn<'credentials'>('credentials', {
        email: person.email,
        password: values.password,
        redirect: false,
      })
      if (confirmPassword?.error) {
        handleClose()
        AlertStore.show(t('auth:alerts.invalid-login'), 'error')
        throw new Error('Invalid login')
      }
      const input = {
        firstName: values.firstName,
        lastName: values.lastName,
      }
      const data = await mutation.mutateAsync({ ...person, ...input })
      await signIn<'credentials'>('credentials', {
        email: person.email,
        password: values.password,
        redirect: false,
      })
      handleClose(data.data)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <StyledModal
      open={isOpen}
      onClose={() => handleClose()}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description">
      <Box className={classes.modal}>
        <IconButton className={classes.close} onClick={() => handleClose()}>
          <CloseIcon />
        </IconButton>
        <h2>Обнови име</h2>
        <GenericForm
          onSubmit={onSubmit}
          validationSchema={validationSchema}
          initialValues={{
            firstName: person?.firstName || '',
            lastName: person?.lastName || '',
            password: '',
          }}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={8}>
              <FormTextField
                type="text"
                name="firstName"
                autoComplete="firstName"
                label="first name"
              />
            </Grid>
            <Grid item xs={12} sm={8}>
              <FormTextField
                type="text"
                name="lastName"
                autoComplete="lastName"
                label="last name"
              />
            </Grid>
            <Grid item xs={12} sm={8}>
              <PasswordField />
            </Grid>
            <Grid item xs={6}>
              <SubmitButton fullWidth />
            </Grid>
          </Grid>
        </GenericForm>
      </Box>
    </StyledModal>
  )
}

export default UpdateNameModal
