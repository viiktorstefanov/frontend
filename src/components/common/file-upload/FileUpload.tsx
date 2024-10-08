import { Button } from '@mui/material'

function FileUpload({
  onUpload,
  buttonLabel,
  ...rest
}: {
  onUpload: (files: File[]) => void
  buttonLabel: string
  accept?: string
}) {
  return (
    <label htmlFor="contained-button-file">
      <input
        id="contained-button-file"
        multiple
        type="file"
        style={{ display: 'none' }}
        onChange={(e) => onUpload([...(e.target.files as FileList)])}
        {...rest}
      />
      <Button fullWidth variant="contained" color="info" component="span">
        {buttonLabel}
      </Button>
    </label>
  )
}

export default FileUpload
