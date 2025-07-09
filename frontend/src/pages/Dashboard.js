import React from 'react';
import Navbar from '../components/Navbar';
import TodoList from '../components/TodoList';

const Dashboard = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main className="py-6">
                <TodoList />
            </main>
        </div>
    );
};

export default Dashboard; 