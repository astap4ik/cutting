(() => {
  const rail = document.querySelector('.appRail');
  document.querySelector('.appRail .railLink[href="#partsPanel"]')?.remove();
  const materialsLinks = document.querySelectorAll('.topNav a[href="#materialsPanel"]');
  const settingsLinks = document.querySelectorAll('.appRail .railLink[href="#settingsPanel"], .topNav a[href="#settingsPanel"]');
  const materialLibrary = document.querySelector('.materialsDb');
  const settingsPanel = document.querySelector('#settingsPanel');
  const firstRailLink = rail?.querySelector('.railLink[href="#projectsPanel"]');
  const settingsRailLink = rail?.querySelector('.railLink[href="#settingsPanel"]');
  if (rail && firstRailLink && !rail.querySelector('.railGroupLabel')) {
    const workLabel = document.createElement('div');
    workLabel.className = 'railGroupLabel';
    workLabel.textContent = 'Работа';
    rail.insertBefore(workLabel, firstRailLink);
    const serviceLabel = document.createElement('div');
    serviceLabel.className = 'railGroupLabel railGroupLabelService';
    serviceLabel.textContent = 'Сервис';
    rail.insertBefore(serviceLabel, settingsRailLink);
  }
  const closeSettings = () => { settingsPanel?.classList.remove('settingsOpen'); settingsPanel?.classList.add('hidden'); };
  const closeMaterialLibrary = () => materialLibrary?.classList.add('hidden');
  materialsLinks.forEach(link => link.addEventListener('click', e => { e.preventDefault(); closeSettings(); materialLibrary?.classList.remove('hidden'); }));
  settingsLinks.forEach(link => link.addEventListener('click', e => { e.preventDefault(); e.stopPropagation(); closeMaterialLibrary(); settingsPanel?.classList.remove('hidden'); settingsPanel?.classList.add('settingsOpen'); }));
  document.querySelector('#closeMaterialDb')?.addEventListener('click', closeMaterialLibrary);
  document.querySelector('#closeSettings')?.addEventListener('click', closeSettings);
})();
