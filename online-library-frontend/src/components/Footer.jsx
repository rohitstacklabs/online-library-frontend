const Footer = () => {
  return (
    <footer className="bg-white shadow-inner mt-10">
      <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
        
        <div>
          <h2 className="text-xl font-bold text-gray-800">📚 Online Library</h2>
          <p className="text-sm text-gray-600 mt-2">
            Your digital companion for knowledge, books, and learning.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Quick Links</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li><a href="/books" className="hover:text-indigo-600">Books</a></li>
            <li><a href="/reports" className="hover:text-indigo-600">Reports</a></li>
            <li>
              <a 
                href="https://github.com/rohitstacklabs" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-indigo-600"
              >
                About Us
              </a>
            </li>
            <li><a href="/contact" className="hover:text-indigo-600">Contact</a></li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Get in Touch</h3>
          <p className="text-sm text-gray-600">📍 Bihar Patna, India</p>
          <p className="text-sm text-gray-600">📧 rohitksingh887@library.com</p>
          <p className="text-sm text-gray-600">📞 +91 6200212814</p>
        </div>
      </div>

      <div className="border-t border-gray-200 mt-6 py-4 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Online Library. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
