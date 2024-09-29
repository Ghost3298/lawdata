import React, { useState, useEffect } from "react";
import './styles/Categories.css';
import Modal from 'react-modal'; // Ensure this is installed

const BASE_URL = './php';

const Categories = () => {
    const [categories, setCategories] = useState([]);
    const [category, setCategory] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentCategory, setCurrentCategory] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${BASE_URL}/fetch_categories.php`); // Use constant
            const data = await response.json();
            setCategories(data);
            setError(''); // Clear any previous errors
        } catch (error) {
            setError("Error fetching categories.");
            console.error("Error fetching categories:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await fetch(`${BASE_URL}/add_category.php`, { // Use constant
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ cat_name: category }),
            });
            const data = await response.json();
            if (data.success) {
                fetchCategories(); // Refresh the list
                setCategory(''); // Clear the input
                setError(''); // Clear any previous errors
            } else {
                setError(data.message);
            }
        } catch (error) {
            setError("Error adding category.");
            console.error("Error adding category:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleEditClick = (cat) => {
        setCurrentCategory(cat);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setCurrentCategory(null);
    };

    const handleUpdateCategory = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await fetch(`${BASE_URL}/edit_category.php`, { // Use constant
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(currentCategory),
            });
            const data = await response.json();
            if (data.success) {
                fetchCategories(); // Refresh the list
                handleCloseModal(); // Close modal
                setError(''); // Clear any previous errors
            } else {
                setError(data.message);
            }
        } catch (error) {
            setError("Error updating category.");
            console.error("Error updating category:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteCategory = async (id) => {
        if (!window.confirm("Are you sure you want to delete this category?")) return; // Confirmation dialog
        setLoading(true);
        try {
            const response = await fetch(`${BASE_URL}/delete_category.php`, { // Use constant
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id }),
            });

            const data = await response.json();
            if (data.message === "Category deleted successfully.") {
                fetchCategories(); // Refresh categories after deletion
                handleCloseModal(); // Close modal after deletion
                setError(''); // Clear any previous errors
            } else {
                setError(data.message);
            }
        } catch (error) {
            setError("Error deleting category.");
            console.error("Error deleting category:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            
            <form className="AddArea" onSubmit={handleSubmit}>
                <input 
                    type="text" 
                    value={category} 
                    onChange={(e) => setCategory(e.target.value)} 
                    placeholder="الموضوع..." 
                    required  
                    style={{ borderRadius: '0px 20px 20px 0px' }}
                    id="cat"
                />
                <button type="submit" style={{ borderRadius: '20px 0px 0px 20px' }}>حفظ</button>
            </form>
            {loading && <p>Loading...</p>}
            {error && <p className="error-message">{error}</p>} {/* Display error message */}
            <table className="CatDisplayArea">
                <tbody>
                    {categories.map((cat) => (
                        <tr key={cat.id} className="CategoryItem">
                            <td>{cat.cat_name}</td>
                            <td>
                                <button onClick={() => handleEditClick(cat)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16">
                                        <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                                        <path d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/>
                                    </svg>
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Modal for editing category */}
            <Modal isOpen={isModalOpen} onRequestClose={handleCloseModal} ariaHideApp={false}>
                <h2>تعديل</h2>
                {currentCategory && (
                    <form className="ModalView" onSubmit={handleUpdateCategory}>
                        <input 
                            type="text" 
                            value={currentCategory.cat_name} 
                            onChange={(e) => setCurrentCategory({ ...currentCategory, cat_name: e.target.value })} 
                            required  
                        />
                        <button type="submit">Update</button>
                        <button type="button" onClick={() => handleDeleteCategory(currentCategory.id)}>Delete</button>
                        <button type="button" onClick={handleCloseModal}>Close</button>
                    </form>
                )}
            </Modal>
        </>
    );
};

export default Categories;
