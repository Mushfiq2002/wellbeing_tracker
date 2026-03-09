const Home = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] text-center px-4">
            <h1 className="text-5xl font-extrabold text-blue-900 mb-6 drop-shadow-sm">Welcome to MERN Boilerplate</h1>
            <p className="text-xl text-gray-600 max-w-2xl mb-8">
                This app uses Vite, React, React Router v6, Tailwind CSS v4, Redux Toolkit, and an Express MVC backend.
            </p>
            <div className="flex space-x-4">
                <a href="#features" className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transform hover:-translate-y-1 transition duration-200">View Features</a>
                <a href="https://github.com" target="_blank" rel="noreferrer" className="px-6 py-3 bg-white text-gray-800 border border-gray-300 rounded-lg shadow hover:bg-gray-50 transition duration-200">GitHub Repo</a>
            </div>
        </div>
    );
};

export default Home;
