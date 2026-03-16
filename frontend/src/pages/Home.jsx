const Home = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] text-center px-4">
            <h1 className="text-5xl font-extrabold text-blue-900 mb-6 drop-shadow-sm">Welcome to Wellbeing Tracker</h1>
            <p className="text-xl text-gray-600 max-w-2xl mb-8">
                This app helps you track your sleep, to-do list, and medicine reminders and many more exciting features.
            </p>
            <div className="flex space-x-4">
                <a href="https://github.com/Mushfiq2002/wellbeing_tracker" target="_blank" rel="noreferrer" className="px-6 py-3 bg-white text-gray-800 border border-gray-300 rounded-lg shadow hover:bg-gray-50 transition duration-200">GitHub Repo</a>
            </div>
        </div>
    );
};

export default Home;
