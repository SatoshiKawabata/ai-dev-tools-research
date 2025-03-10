import React from 'react';
import SignupForm from '../components/auth/SignupForm';
import Layout from '../components/layout/Layout';

const SignupPage: React.FC = () => {
    return (
        <Layout>
            <h1>Sign Up</h1>
            <SignupForm />
        </Layout>
    );
};

export default SignupPage;