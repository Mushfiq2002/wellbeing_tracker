const About = () => {
    return (
        <div className="max-w-4xl mx-auto px-4 py-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 border-b pb-2">About This Project</h2>
            <p className="text-lg text-gray-700 mb-4">
                A starter template designed to help you build full-stack web applications quickly.
            </p>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h3 className="text-xl font-semibold mb-3">Tech Stack Highlights</h3>
                <ul className="list-disc pl-5 space-y-2 text-gray-600">
                    <li><strong>Frontend:</strong> React 19, Vite, Tailwind CSS v4, React Router DOM, Redux Toolkit.</li>
                    <li><strong>Backend:</strong> Node.js, Express, MongoDB (Mongoose), pure MVC architecture.</li>
                </ul>
            </div>
        </div>
    );
};

export default About;
