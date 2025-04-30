import React, { use } from 'react';
import { AuthProvider } from '../authProviderBTP';

// Default implementation, that you can customize
export default function Root({ children }) {
    return <AuthProvider>{children}</AuthProvider>;
}