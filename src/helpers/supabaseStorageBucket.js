import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const bucket_name = process.env.SUPABASE_BUCKET_NAME;

const generateUploadURL = async (req, res) => {
    const { fileName } = req.body;

    if (!fileName || !bucket_name) {
        return res.status(400).json({ error: "fileName and bucket are required" });
    }

    // Step 1: Delete the existing file (if it exists)
    const { dataDrop, errorDrop } = await supabase.storage.from(bucket_name).remove([fileName]);
    if (errorDrop) {
        console.error('Error deleting file:', errorDrop);
        return res.status(500).json({ error: errorDrop.message });
    }

    // Generate a signed URL for upload (PUT)
    const { data, error } = await supabase.storage
        .from(bucket_name)
        .createSignedUploadUrl(fileName, 60); // expires in 60 seconds
    if (error) {
        console.error("Signed URL generation error:", error);
        return res.status(500).json({ error: error.message });
    }
    return res.json({ signedUrl: data.signedUrl });
};

export default generateUploadURL;
