import React from 'react';

function Logout({ setAuth }) {

    const handleLogout = async () => {
        fetch('/logout', { method: 'POST' })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    console.log('Logout successful!');
                    setAuth(false);
                } else {
                    alert('Logout failed: ' + data.message);
                }
            })
            .catch((error) => {
                alert('Oops, something went wrong: ' + error.message);
            });
    };

    return (
        <button onClick={handleLogout}>Logout</button>
    );
};

export default Logout;