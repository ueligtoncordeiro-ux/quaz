const achados = [
  {
    tag: "Achado Quáz",
    tagColor: "orange",
    store: "Padaria São João",
    description: "Combo surpresa de pães e doces frescos",
    price: "R$ 8,90",
    time: "Retirada até 19h",
  },
  {
    tag: "Última unidade",
    tagColor: "green",
    store: "Mercado do Bairro",
    description: "Frutas e legumes selecionados do dia",
    price: "R$ 12,90",
    time: "Retirada até 20h",
  },
  {
    tag: "Achado Quáz",
    tagColor: "orange",
    store: "Bistrô da Praça",
    description: "Marmita executiva — 2 opções",
    price: "R$ 14,90",
    time: "Retirada até 14h",
  },
];

export function PhoneMockup() {
  return (
    <div className="phoneWrap" aria-label="Prévia do aplicativo Quáz di Graça">
      <div className="phoneFrame">
        {/* Dynamic island */}
        <div className="phoneDynamicIsland" />

        {/* Status bar */}
        <div className="phoneStatusBar">
          <span className="phoneTime">9:41</span>
          <div className="phoneStatusIcons">
            <svg width="16" height="12" viewBox="0 0 16 12" fill="currentColor">
              <rect x="0" y="4" width="3" height="8" rx="1" opacity="0.4"/>
              <rect x="4" y="2.5" width="3" height="9.5" rx="1" opacity="0.6"/>
              <rect x="8" y="1" width="3" height="11" rx="1" opacity="0.8"/>
              <rect x="12" y="0" width="3" height="12" rx="1"/>
            </svg>
            <svg width="18" height="12" viewBox="0 0 24 16" fill="currentColor">
              <path d="M12 3C8.4 3 5.2 4.4 2.9 6.7L1 4.8C3.8 2 7.7 0 12 0s8.2 2 11 4.8l-1.9 1.9C18.8 4.4 15.6 3 12 3z" opacity="0.4"/>
              <path d="M12 7c-2.4 0-4.6 1-6.2 2.6L4 7.8C6.1 5.7 8.9 4.4 12 4.4s5.9 1.3 8 3.4l-1.8 1.8C16.6 8 14.4 7 12 7z" opacity="0.7"/>
              <path d="M12 11c-1.3 0-2.4.5-3.2 1.3L12 16l3.2-3.7C14.4 11.5 13.3 11 12 11z"/>
            </svg>
            <svg width="25" height="12" viewBox="0 0 25 12" fill="currentColor">
              <rect x="0" y="1" width="22" height="10" rx="2.5" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.35"/>
              <rect x="22.5" y="3.5" width="2" height="5" rx="1" opacity="0.4"/>
              <rect x="1.5" y="2.5" width="17" height="7" rx="1.5" opacity="0.9"/>
            </svg>
          </div>
        </div>

        {/* App header */}
        <div className="phoneAppHeader">
          <div className="phoneLocation">
            <svg width="10" height="13" viewBox="0 0 10 13" fill="none">
              <path d="M5 0C2.24 0 0 2.24 0 5c0 3.75 5 8 5 8s5-4.25 5-8c0-2.76-2.24-5-5-5zm0 6.5C4.17 6.5 3.5 5.83 3.5 5S4.17 3.5 5 3.5 6.5 4.17 6.5 5 5.83 6.5 5 6.5z" fill="#FF6900"/>
            </svg>
            <div>
              <span className="phoneLocationLabel">Sua localização</span>
              <strong className="phoneLocationCity">Tangará da Serra, MT</strong>
            </div>
          </div>
          <div className="phoneAvatarDot" />
        </div>

        {/* Content */}
        <div className="phoneContent">
          <p className="phoneContentTitle">
            <strong>3 achados</strong> perto de você
          </p>

          <div className="phoneCards">
            {achados.map((a, i) => (
              <div key={i} className={`phoneCard phoneCard--${a.tagColor}`}>
                <div className="phoneCardHeader">
                  <span className={`phoneCardTag phoneCardTag--${a.tagColor}`}>{a.tag}</span>
                  <span className="phoneCardTime">{a.time}</span>
                </div>
                <strong className="phoneCardStore">{a.store}</strong>
                <p className="phoneCardDesc">{a.description}</p>
                <div className="phoneCardFooter">
                  <strong className="phoneCardPrice">{a.price}</strong>
                  <button className="phoneCardBtn" tabIndex={-1}>Resgatar</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom nav */}
        <div className="phoneNav">
          <div className="phoneNavItem phoneNavItem--active">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
            </svg>
            <span>Início</span>
          </div>
          <div className="phoneNavItem">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" opacity="0.4">
              <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
            </svg>
            <span>Buscar</span>
          </div>
          <div className="phoneNavItem">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" opacity="0.4">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 3c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm7 13H5v-.23c0-.62.28-1.2.76-1.58C7.47 15.82 9.64 15 12 15s4.53.82 6.24 2.19c.48.38.76.97.76 1.58V19z"/>
            </svg>
            <span>Perfil</span>
          </div>
        </div>
      </div>

      {/* Floating badge */}
      <div className="phoneBadge">
        <span>✨</span> até 70% off
      </div>
    </div>
  );
}
