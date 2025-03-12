import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { formBuilderPlugin } from '@payloadcms/plugin-form-builder'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig, Field } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || '',
  }),
  sharp,
  plugins: [
    formBuilderPlugin({
      formOverrides: {
        admin: {
          useAsTitle: 'form',
        },
        fields: ({ defaultFields }) => {
          const formField: Field = {
            name: 'form',
            type: 'select',
            options: [{ label: 'Contact', value: 'contact' }],
          }
          const rest = defaultFields.filter(
            (field) =>
              'name' in field &&
              field.name !== 'title' &&
              field.name !== 'fields' &&
              field.name !== 'submitButtonLabel',
          )
          return [formField, ...rest]
        },
      },
    }),
  ],
})
