import React, { useState, useEffect } from "react";
import './styles/Search.css';
import Modal from 'react-modal'; // Ensure this is installed

const BASE_URL = 'http://localhost/lawdata/public/php';

const Search = () => {
    const [categories, setCategories] = useState([]);
    const [contents, setContents] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDocumentModalOpen, setIsDocumentModalOpen] = useState(false);
    const [currentContent, setCurrentContent] = useState(null);
    const [currentDocument, setCurrentDocument] = useState(null); // State to store the document
    const [loading, setLoading] = useState(false);
    const [newDocument, setNewDocument] = useState(null); // State to store the new document file

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch(`${BASE_URL}/fetch_categories.php`);
                const data = await response.json();
                console.log("Fetched categories:", data); // Log fetched categories
                setCategories(data);
            } catch (error) {
                console.error("Error fetching categories:", error);
                setError("Error fetching categories");
            }
        };
        fetchCategories();
    }, []);

    const fetchContents = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${BASE_URL}/fetch_content.php?cat_id=${selectedCategory}&search_term=${searchTerm}`);
            const data = await response.json();
            setContents(data);
        } catch (error) {
            console.error("Error fetching contents:", error);
            setError("Error fetching contents");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchContents();
    }, [selectedCategory, searchTerm]);

    const handleCategoryChange = (e) => {
        setSelectedCategory(e.target.value);
        setSearchTerm('');
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const highlightText = (text, search) => {
        if (!search) return text;
        const regex = new RegExp(`(${search})`, 'gi');
        const parts = text.split(regex);
        return parts.map((part, index) =>
            part.toLowerCase() === search.toLowerCase() ? (
                <span key={index} className="highlight">{part}</span>
            ) : part
        );
    };

    const handleEditClick = (content) => {
        setCurrentContent(content);
        setCurrentDocument(content.document); // Set the current document for editing
        setIsEditModalOpen(true);
    };

    const handleCloseEditModal = () => {
        setIsEditModalOpen(false);
        setCurrentContent(null);
        setNewDocument(null); // Reset the new document state
    };

    const handleUpdateContent = async (contentData) => {
        const formData = new FormData();
        formData.append('id', contentData.id);
        formData.append('cat_id', contentData.cat_id);
        formData.append('content_text', contentData.content_text);
        if (contentData.document) {
            formData.append('document', contentData.document); // Append file if exists
        }
    
        try {
            const response = await fetch(`${BASE_URL}/edit_content.php`, {
                method: 'POST',
                body: formData, // Send form data
            });
    
            const result = await response.json();
            if (result.success) {
                console.log('Content updated successfully');
            } else {
                console.error('Error updating content:', result.message);
            }
        } catch (error) {
            console.error('Failed to fetch:', error);
        }
    };
    

    const handleDeleteContent = async (id) => {
        if (!window.confirm("Are you sure you want to delete this content?")) return; // Confirmation dialog
        setLoading(true);
        try {
            const response = await fetch(`${BASE_URL}/delete_content.php`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id }),
            });
    
            const data = await response.json();
            if (data.message === "Content deleted successfully.") {
                fetchContents(); // Refresh the contents
                setError(''); // Clear any previous errors
                handleCloseEditModal(); // Close the edit modal after deletion
            } else {
                setError(data.message);
            }
        } catch (error) {
            setError("Error deleting content.");
            console.error("Error deleting content:", error);
        } finally {
            setLoading(false);
        }
    };
       

    const handleContentClick = (content) => {
        setCurrentDocument(content.document); // Set the document related to the content
        setIsDocumentModalOpen(true); // Open document modal
    };

    const handleCloseDocumentModal = () => {
        setIsDocumentModalOpen(false);
        setCurrentDocument(null);
    };

    return (
        <>
            <div className="SearchArea">
                <select 
                    className="SearchAreaChild" 
                    style={{ borderRadius: '0px 20px 20px 0px', textAlign: 'center', fontWeight: 'bold' }} 
                    value={selectedCategory}
                    onChange={handleCategoryChange}
                    id="searchCat"
                >
                    <option value="">الموضوع</option>
                    {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>{cat.cat_name}</option>
                    ))}
                </select>

                <input 
                    type="text" 
                    className="SearchAreaChild" 
                    placeholder="المضمون..." 
                    style={{ borderRadius: '20px 0px 0px 20px' }} 
                    value={searchTerm}
                    onChange={handleSearchChange}
                    id="searchText"
                />
            </div>

            {loading && <p>Loading...</p>}
            {error && <p className="error-message">{error}</p>} {/* Display error message */}

            <table className="CatDisplayArea">
                <tbody>
                    {contents.length > 0 ? (
                        contents.map(content => (
                            <tr key={content.id}>
                                <td onClick={() => handleContentClick(content)}>
                                    {highlightText(content.content_text, searchTerm)}
                                </td>
                                <td>
                                    <button onClick={() => handleEditClick(content)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16">
                                            <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                                            <path d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/>
                                        </svg>
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr><td colSpan="2">لا توجد نتائج</td></tr>
                    )}
                </tbody>
            </table>

            <Modal isOpen={isEditModalOpen} onRequestClose={handleCloseEditModal} ariaHideApp={false}>
                <h2>تعديل المحتوى</h2>
                {currentContent && (
                    <form className="ModalView" onSubmit={(e) => {
                        e.preventDefault(); // Prevent default form submission
                        handleUpdateContent(currentContent); // Call update function with the currentContent
                    }}>
                        <select
                        // Set the current selected value
                            onChange={(e) => setCurrentContent({ ...currentContent, cat_id: e.target.value })} // Update the state on change
                        >
                            {/* Display the currently selected category as the first option */}
                            <option key={currentContent.cat_id_fk} value={currentContent.cat_id_fk}>
    {
        categories.find(cat => cat.id === currentContent.cat_id_fk)
            ? categories.find(cat => cat.id === currentContent.cat_id_fk).cat_name
            : "Select a category" // Fallback if no match is found
    }
</option>

                            
                            {/* Map through categories and display them as options */}
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.cat_name}</option>
                            ))}
                        </select>



                        <textarea
                            value={currentContent.content_text || ""}
                            onChange={(e) => setCurrentContent({ ...currentContent, content_text: e.target.value })}
                        />

                        <label>
                            <span>تغيير المستند:</span>
                            <input 
                                type="file" 
                                onChange={(e) => setNewDocument(e.target.files[0])} 
                            />
                        </label>
                        
                        <button type="submit">Update</button>
                        <button type="button" onClick={() => handleDeleteContent(currentContent.id)}>Delete</button>
                        <button type="button" onClick={handleCloseEditModal}>Cancel</button>
                    </form>
                )}
                {error && <p className="error-message">{error}</p>}
            </Modal>


            {/* Modal for displaying the document */}
            <Modal isOpen={isDocumentModalOpen} onRequestClose={handleCloseDocumentModal} ariaHideApp={false}>
                <h2>عرض المستند</h2>
                {currentDocument ? (
                    <iframe
                        src={`${BASE_URL}/uploads/${currentDocument}`}
                        width="100%"
                        height="600px"
                        title="Document Preview"
                    />
                ) : (
                    <p>لا يوجد مستند للعرض.</p>
                )}
                <button onClick={handleCloseDocumentModal}>إغلاق</button>
            </Modal>
        </>
    );
};

export default Search;
