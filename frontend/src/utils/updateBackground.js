export const updateBackground = (page) => {
    const selectedStyle = Number(localStorage.getItem('selectedStyle'));
    const back = document.querySelector('.background');
    if(back) {
      if (selectedStyle === 0) {
        if (page === 'main' || page === 'styles') {
          back.style.background = 'linear-gradient(180deg, #0D0D0D 0%, #222 100%) fixed';
        } else if (page === 'auction') {
          back.style.background = '#0D0D0D';
        } else if (page === 'referral') {
          back.style.background = 'linear-gradient(167deg, #000 8.46%, #474747 96.84%) fixed';
        } else if (page === 'rating') {
          back.style.background = 'linear-gradient(167deg, #000 8.46%, #474747 96.84%) fixed'
        }
      } else if (selectedStyle === 1) {
        back.style.background = 'linear-gradient(164deg, #000 -0.67%, rgba(71, 71, 71, 0.70) 96.72%), #FF501C fixed';
      } else if (selectedStyle === 2) {
        back.style.background = 'linear-gradient(164deg, #000 -6.52%, rgba(71, 71, 71, 0.70) 96.74%), #FFBF00 fixed';
      } else if (selectedStyle === 3) {
        back.style.background = 'linear-gradient(163deg, #000 -34.89%, rgba(71, 71, 71, 0.70) 96.68%), #FF7A00 fixed';
      }
    }
};