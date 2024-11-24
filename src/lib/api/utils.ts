import toast from 'react-hot-toast';

export const callApi = async <Output>({
  method,
  url,
  body,
  headers,
  onSuccess,
  onError,
}: {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  url: string;
  body?: any;
  headers?: any;
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
}) => {
  try {
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      ...(body && { body: JSON.stringify(body) }),
    });
    if (response.ok) {
      const data = await response.json();
      onSuccess?.(data);
    } else {
      const error = await response.json();
      onError?.(error);
    }
  } catch (error) {
    onError?.(error);
  }
};

export const loginWithEmailPassword = ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  return callApi({
    method: 'POST',
    url: '/api/login',
    body: {
      email,
      password,
    },
    onSuccess: (data) => {
      toast.success('Hooray!! Logged in successfully');
    },
    onError: (error) => {
      toast.error(error?.message || 'Something went wrong');
    },
  });
};

export const signUpWithEmailPassword = ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  return callApi({
    method: 'POST',
    url: '/api/signup',
    body: {
      email,
      password,
    },
    onSuccess: (data) => {
      toast.success('Hooray!! Signed up successfully');
    },
    onError: (error) => {
      toast.error(error?.message || 'Something went wrong');
    },
  });
};

export const signOut = () => {
  return callApi({
    method: 'DELETE',
    url: '/api/logout',
    onSuccess: (data) => {
      toast.success('Logged out successfully');
    },
    onError: (error) => {
      toast.error(error?.message || 'Something went wrong');
    },
  });
};

export const linkDocuments = (docUrl: string) => {
  return callApi({
    method: 'POST',
    url: '/api/link-document-to-user',
    body: {
      docUrl,
    },
    onSuccess: (data) => {
      toast.success('Documents linked successfully');
    },
    onError: (error) => {
      toast.error(error?.message || 'Something went wrong');
    },
  });
};

export const unlinkDocuments = (docUrl: string) => {
  return callApi({
    method: 'POST',
    url: '/api/unlink-document-to-user',
    body: {
      docUrl,
    },
    onSuccess: () => {
      toast.success('Documents unlinked successfully');
    },
    onError: (error) => {
      toast.error(error?.message || 'Something went wrong');
    },
  });
};

export const fetchDocuments = () => {
  return new Promise((resolve, reject) =>
    callApi({
      method: 'GET',
      url: '/api/fetch-documents',
      onSuccess: (data) => {
        toast.success('Documents fetched successfully');
        return resolve(data);
      },
      onError: (error) => {
        toast.error(error?.message || 'Something went wrong');
        reject(error);
      },
    }),
  );
};

export const generateEmbeddings = (payload: Record<string, any>) => {
  return callApi({
    method: 'POST',
    url: '/api/generate-embeddings',
    body: payload,
    onSuccess: (data) => {
      toast.success('Embeddings Generated');
    },
    onError: (error) => {
      toast.error(error?.message || 'Something went wrong');
    },
  });
};

export const saveSearchConfigs = (payload: Record<string, any>) => {
  return callApi({
    method: 'POST',
    url: '/api/save-search-configs',
    body: payload,
    onSuccess: (data) => {
      toast.success('Settings Saved Successfully');
    },
    onError: (error) => {
      toast.error(error?.message || 'Something went wrong');
    },
  });
};
