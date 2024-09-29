import React, { useState, useEffect } from "react";
import './styles/Search.css';
import Modal from 'react-modal'; // Ensure this is installed

const BASE_URL = './php';

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
        // Basic validation
        if (!contentData.cat_id_fk || !contentData.content_text) {
            setError("Please select a category and enter content text.");
            return;
        }
    
        setLoading(true);
        const formData = new FormData();
        formData.append('id', contentData.id);
        formData.append('cat_id_fk', contentData.cat_id_fk);
        formData.append('content_text', contentData.content_text);
        
        if (newDocument) {
            formData.append('document', newDocument); // Append new file if exists
        }
        
        try {
            const response = await fetch(`${BASE_URL}/edit_content.php`, {
                method: 'POST',
                body: formData, // Send form data
            });
    
            const result = await response.json();
            if (result.success) {
                console.log('Content updated successfully');
                fetchContents(); // Refresh contents after update
            } else {
                console.error('Error updating content:', result.message);
                setError(result.message); // Set error message if update fails
            }
        } catch (error) {
            console.error('Failed to fetch:', error);
            setError("Failed to update content");
        } finally {
            setLoading(false);
            handleCloseEditModal(); // Close modal after processing
        }
    };
    

    const handleDeleteContent = async (id) => {
        if (!window.confirm("Are you sure you want to delete this content?")) return;
        setLoading(true);
        try {
            const response = await fetch(`${BASE_URL}/delete_content.php`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id }), // Correctly pass the id
            });
    
            const data = await response.json();
            if (data.message === "Content deleted successfully.") {
                fetchContents();
                setError('');
                handleCloseEditModal();
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
                                <td>
                                    <button onClick={() => handleDeleteContent(content.id)}>
                                        Delete
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
                            value={currentContent.cat_id_fk} // Set the correct value
                            onChange={(e) => setCurrentContent({ ...currentContent, cat_id_fk: e.target.value })} // Update category
                        >
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>{cat.cat_name}</option>
                            ))}
                        </select>
                        <textarea
                            value={currentContent.content_text}
                            onChange={(e) => setCurrentContent({ ...currentContent, content_text: e.target.value })} // Update content text
                        />
                        <input
                            type="file"
                            onChange={(e) => setNewDocument(e.target.files[0])} // Set new document file
                        />
                        {currentDocument && (
                            <p>Document: {currentDocument}</p> // Display current document name
                        )}
                        <button type="submit">Update</button>
                        <button onClick={handleCloseEditModal}>Cancel</button>
                    </form>
                )}
                

            </Modal>

            <Modal isOpen={isDocumentModalOpen} onRequestClose={handleCloseDocumentModal} ariaHideApp={false}>
                <h2>عرض الوثيقة</h2>
                {currentDocument ? (
                    <iframe src={`${BASE_URL}/uploads/${currentDocument}`} title="Document" width="100%" height="600px"></iframe>
                ) : (
                    <p>No document available</p>
                )}
                <button onClick={handleCloseDocumentModal}>إغلاق</button>
            </Modal>
        </>
    );
};

export default Search;
