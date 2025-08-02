import crypto from 'crypto';

export const CLOUDINARY_FOLDERS = {
  BLOGS: 'mandala/blogs',
  PRODUCTS: 'mandala/products', 
  PAYMENTS: 'mandala/payments',
} as const;

export const UPLOAD_CONFIGS = {
  blog: {
    folder: CLOUDINARY_FOLDERS.BLOGS,
    transformation: 'c_fill,w_1200,h_630,q_auto,f_webp'
  },
  product: {
    folder: CLOUDINARY_FOLDERS.PRODUCTS,
    transformation: 'c_fill,w_800,h_800,q_auto,f_webp'
  },
  payment: {
    folder: CLOUDINARY_FOLDERS.PAYMENTS,
    transformation: 'c_fit,w_400,h_200,q_auto,f_webp'
  }
} as const;

type UploadType = keyof typeof UPLOAD_CONFIGS;

// Generate upload signature 
function generateSignature(paramsToSign: Record<string, any>): string {
  const sortedParams = Object.keys(paramsToSign)
    .sort()
    .map(key => `${key}=${paramsToSign[key]}`)
    .join('&');
  
  const stringToSign = sortedParams + process.env.CLOUDINARY_API_SECRET;
  
  return crypto.createHash('sha1').update(stringToSign).digest('hex');
}

export const uploadToCloudinaryAPI = async (
  file: File | string,
  type: UploadType = 'blog',
  customFileName?: string
): Promise<{ url: string; publicId: string }> => {
  try {
    const config = UPLOAD_CONFIGS[type];
    let fileData: string;

    if (file instanceof File) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      fileData = `data:${file.type};base64,${buffer.toString('base64')}`;
    } else {
      fileData = file;
    }

    const timestamp = Math.round(Date.now() / 1000);
    
    const uploadParams: Record<string, any> = {
      timestamp,
      folder: config.folder,
      transformation: config.transformation,
      api_key: process.env.CLOUDINARY_API_KEY,
    };

    if (customFileName) {
      uploadParams.public_id = `${config.folder}/${customFileName}`;
    }

    const signature = generateSignature(uploadParams);

    const formData = new FormData();
    formData.append('file', fileData);
    formData.append('timestamp', timestamp.toString());
    formData.append('folder', config.folder);
    formData.append('transformation', config.transformation);
    formData.append('api_key', process.env.CLOUDINARY_API_KEY!);
    formData.append('signature', signature);

    if (customFileName) {
      formData.append('public_id', `${config.folder}/${customFileName}`);
    }

    // Upload to Cloudinary
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Cloudinary upload failed: ${response.status} ${errorText}`);
    }

    const result = await response.json();

    return {
      url: result.secure_url,
      publicId: result.public_id,
    };
  } catch (error) {
    console.error('Cloudinary API upload error:', error);
    throw new Error('Failed to upload to Cloudinary');
  }
};

export const deleteFromCloudinaryAPI = async (publicId: string): Promise<void> => {
  try {
    const timestamp = Math.round(Date.now() / 1000);
    
    const paramsToSign = {
      public_id: publicId,
      timestamp,
      api_key: process.env.CLOUDINARY_API_KEY,
    };

    const signature = generateSignature(paramsToSign);

    const formData = new FormData();
    formData.append('public_id', publicId);
    formData.append('timestamp', timestamp.toString());
    formData.append('api_key', process.env.CLOUDINARY_API_KEY!);
    formData.append('signature', signature);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/destroy`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Cloudinary delete failed: ${response.status} ${errorText}`);
    }
  } catch (error) {
    console.error('Cloudinary API delete error:', error);
    throw new Error('Failed to delete from Cloudinary');
  }
};

// Helper function to extract public ID from Cloudinary URL
export const extractPublicId = (url: string): string => {
  try {
    const parts = url.split('/');
    const uploadIndex = parts.findIndex(part => part === 'upload');
    if (uploadIndex === -1) return '';
    
    const afterUpload = parts.slice(uploadIndex + 1);
    let publicIdParts = afterUpload;
    
    if (afterUpload[0] && afterUpload[0].startsWith('v') && /^\d+$/.test(afterUpload[0].substring(1))) {
      publicIdParts = afterUpload.slice(1);
    }
    
    const publicId = publicIdParts.join('/');
    return publicId.replace(/\.[^/.]+$/, ''); 
  } catch (error) {
    console.error('Error extracting public ID:', error);
    return '';
  }
};

export const uploadToCloudinary = uploadToCloudinaryAPI;
export const deleteFromCloudinary = deleteFromCloudinaryAPI;
