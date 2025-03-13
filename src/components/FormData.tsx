import { JSONFieldServerComponent } from 'payload'
import { Card, CardContent } from './ui/card'
import { ContactFormData } from './ContactForm'

const FormData: JSONFieldServerComponent = ({ data }) => {
  const { email, message, name } = data.submissionData as ContactFormData
  return (
    <Card>
      <CardContent className="space-y-2">
        <div>
          <p className="font-semibold">
            Name: <span className="font-normal">{name}</span>
          </p>
        </div>
        <div>
          <p className="font-semibold">
            Email: <span className="font-normal">{email}</span>
          </p>
        </div>
        <div className="pt-4">
          <p className="font-semibold">Message:</p>
          <p className="font-normal max-w-prose">{message}</p>
        </div>
      </CardContent>
    </Card>
  )
}

export default FormData
