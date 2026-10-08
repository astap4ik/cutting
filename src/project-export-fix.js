// Fallback for pages that still have a cached projects.js without getProjectSnapshot().
if(!window.getProjectSnapshot){
  window.getProjectSnapshot=()=>{
    try{
      const projects=JSON.parse(localStorage.getItem('cuttingProjects')||'[]');
      return projects[0]?JSON.parse(JSON.stringify(projects[0])):null;
    }catch{return null}
  };
}
