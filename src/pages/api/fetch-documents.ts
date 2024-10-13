import type { NextApiRequest, NextApiResponse } from 'next'
import { getCookie } from 'cookies-next'
import { supabseAuthClient } from '@/lib/supabase/auth'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' })
    }

    try {
        const token = getCookie('access_token', { req, res });
        const user = await supabseAuthClient.supabaseAuth.getUser(token);
        if (!user.data.user) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const { data, error } = await supabseAuthClient.supabase.from('documents').select().eq('user_id', user.data.user.id).select('documents');
        if (error) {
            return res.status(422).json({ success: false, message: 'Something went wrong' });
        }

        const finalDocs = data?.[0]?.documents || []

        const docsWithUrl = await Promise.all(finalDocs.map(async (doc: string) => {
            const path = doc.split('/').at(-1)
            const { data } = await supabseAuthClient.supabase.storage.from('audio-kb').getPublicUrl(path || '')
            return {
                id: path,
                url: data.publicUrl
            }
        }))
        res.status(200).json(docsWithUrl || [])
    } catch (error) {
        console.error('Error reading uploads directory:', error)
        res.status(500).json({ message: 'Error fetching documents' })
    }
}