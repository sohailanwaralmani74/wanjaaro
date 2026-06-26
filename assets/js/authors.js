const posts = [
    {
        name: 'Sohail Anwar',
        jobTitle: 'Senior Software engineer',
        about:'Proficient problem-solver and collaborator, skilled at translating business requirements into robust technical solutions.',
        skills:['Java','Angular','Spring Boot','Android',],
        image:'assets/img/sohail-anwar.png',
        url:'sohail-anwar'
    },

]
        const authorsGrid = document.getElementById('authorsGrid');
        
        function renderAuthor(postArray) {
            authorsGrid.innerHTML = '';
            
            postArray.forEach(author => {
                const authorCard = document.createElement('div');
                authorCard.innerHTML = `
                     <div class="profile-container">
                       <div class="profile-card">
                         <div class="profile-image">
                             <img src="${author.image}" alt="${author.name}">
                         </div>
                         <div class="profile-content">
                          <h2 style="display:flex; justify-content: center;">${author.name}</h2>
                          <p class="title">${author.jobTitle}</p>
                          <p class="bio">${author.about}</p>
                          <div class="skills">
                          ${author.skills.map(skill => `<span class="tag">${skill}</span>`).join('')}
                         </div>
                         <a href="author.url" class="profile-button">View Profile</a>
                        </div>
                      </div>
                `;
                authorsGrid.appendChild(authorCard);
            });
        }
        renderAuthor(posts);
        
        // Search Functionality
        const blogSearch = document.getElementById('blogSearch');
        
        blogSearch.addEventListener('input', () => {
            const searchTerm = blogSearch.value.toLowerCase();
            
            if (searchTerm === '') {
                renderAuthor(posts);
                return;
            }
            
            const filteredAuthors = posts.filter(post => 
                post.title.toLowerCase().includes(searchTerm) || 
                post.description.toLowerCase().includes(searchTerm) ||
                post.tags.some(tag => tag.toLowerCase().includes(searchTerm))
            );
            
            renderAuthor(filteredAuthors);
        });              
        