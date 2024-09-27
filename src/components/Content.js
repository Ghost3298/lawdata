import React, { useState, useEffect } from "react";
import './styles/Content.css';

const BASE_URL = 'http://lawdata.rf.gd'; // Base URL constant

const Content = () => {
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [contentText, setContentText] = useState(''); // State for content text

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch(`${BASE_URL}/fetch_categories.php`);
                const data = await response.json();
                setCategories(data);
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };

        fetchCategories();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission
    
        // Create a FormData object to handle the file
        const formData = new FormData();
        formData.append('cat_id', selectedCategory);
        formData.append('content_text', contentText);
    
        // Get the file input element
        const fileInput = e.target.querySelector('input[type="file"]');
        if (fileInput.files.length > 0) {
            formData.append('file', fileInput.files[0]); // Append the selected file
        }
    
        try {
            const response = await fetch(`${BASE_URL}/add_content.php`, {
                method: 'POST',
                body: formData, // Send FormData instead of JSON
            });
            
            const data = await response.json();
            if (data.success) {
                alert(data.message); // Handle success message
                // Optionally reset the form
                setSelectedCategory('');
                setContentText('');
                fileInput.value = ''; // Reset file input
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error("Error adding content:", error);
            alert("Error adding content.");
        }
    };
    

    return (
        <>
            <form className="contentAddArea" onSubmit={handleSubmit}> {/* Attach handleSubmit here */}
                <select 
                    className="contentAreaChild" 
                    style={{ borderRadius: '20px', textAlign: 'center', fontWeight: 'bold' }} 
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                >
                    <option value="">الموضوع</option>
                    {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>{cat.cat_name}</option>
                    ))}
                </select>

                <textarea 
                    className="contentAreaChild"
                    value={contentText} // Bind textarea value to state
                    onChange={(e) => setContentText(e.target.value)} // Update state on change
                />

                <input className="contentAreaChild" style={{marginTop: "25px", borderRadius: "20px"}} type="file" accept="image/*,.pdf,.doc,.docx"/>

                <button type="submit">حفظ</button>
            </form>
        </>
    );
};

export default Content;
