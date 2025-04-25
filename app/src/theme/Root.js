import React, { use } from 'react';
import { AuthProvider } from '../authProviderApprouter';

// Default implementation, that you can customize
export default function Root({ children }) {
    return <AuthProvider>{children}</AuthProvider>;
}