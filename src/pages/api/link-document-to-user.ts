
import { NextApiRequest, NextApiResponse } from 'next';
import { getCookie } from 'cookies-next';
import { supabseAuthClient } from '@/lib/supabase/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { docUrl } = req.body;
        try {
            const token = getCookie('access_token', { req, res });
            const user = await supabseAuthClient.supabaseAuth.getUser(token);
            if (!user.data.user) {
                return res.status(401).json({ success: false, message: 'Invalid credentials' });
            }

            const finalDocs = [docUrl]
            const { data: checkExistingUserDocs } = await supabseAuthClient.supabase.from('documents').select().eq('user_id', user.data.user.id).select('documents');

            console.log('checkExistingUserDocs', checkExistingUserDocs)
            if (checkExistingUserDocs && checkExistingUserDocs.length > 0) {
                checkExistingUserDocs[0].documents.flatMap((doc: any) => {
                    finalDocs.push(doc)
                })
            }
            const { data, error } = await supabseAuthClient.supabase.from('documents').upsert({
                user_id: user.data.user.id,
                documents: finalDocs,
            }, {
                ignoreDuplicates: false,
                onConflict: 'user_id',
            }).select();

            if (error) {
                return res.status(422).json({ success: false, message: error.message });
            }

            return res.status(200).json({ data, message: 'Login successful' });
        } catch (e) {
            res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}