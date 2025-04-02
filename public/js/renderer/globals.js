document.addEventListener('DOMContentLoaded', () => {
    waitForApi("mexapi", (api) => {  
        // set up the application 
        // global preload.
        api.generalPreload.index();
    });
});