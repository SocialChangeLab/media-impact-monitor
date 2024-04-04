'use client'

import dataProviderSimpleRest from '@refinedev/simple-rest'

const API_URL = process.env.NEXT_PUBLIC_API_URL

if (!API_URL) throw new Error('NEXT_PUBLIC_API_URL env variable is not defined')

export const dataProvider = dataProviderSimpleRest(API_URL)
