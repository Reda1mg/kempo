import React from 'react';
import styles from './Support.module.css';

const Support = () => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.iconWrapper}>
          <span className={styles.icon}>🎫</span>
        </div>
        <h1 className={styles.title}>Support & Assistance</h1>
        <p className={styles.subtitle}>
          Besoin d'aide ? Notre équipe support est là pour vous accompagner
        </p>
      </div>

      <div className={styles.content}>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <span className={styles.cardIcon}>📋</span>
            <h2>Service de Ticketing</h2>
          </div>
          <div className={styles.cardContent}>
            <p>
              Notre système de support utilise Jira Service Desk pour vous offrir 
              une assistance rapide et efficace. Créez un ticket pour :
            </p>
            <ul className={styles.featureList}>
              <li>🐛 Signaler un bug ou un problème technique</li>
              <li>💡 Suggérer une nouvelle fonctionnalité</li>
              <li>❓ Poser une question sur l'utilisation</li>
              <li>🔧 Demander une assistance technique</li>
            </ul>
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <span className={styles.cardIcon}>🚀</span>
            <h2>Comment utiliser le ticketing ?</h2>
          </div>
          <div className={styles.cardContent}>
            <div className={styles.steps}>
              <div className={styles.step}>
                <div className={styles.stepNumber}>1</div>
                <div className={styles.stepContent}>
                  <h3>Accéder au portail</h3>
                  <p>Cliquez sur le bouton "Créer un ticket" ci-dessous</p>
                </div>
              </div>
              <div className={styles.step}>
                <div className={styles.stepNumber}>2</div>
                <div className={styles.stepContent}>
                  <h3>Choisir le type de demande</h3>
                  <p>Sélectionnez la catégorie qui correspond à votre problème</p>
                </div>
              </div>
              <div className={styles.step}>
                <div className={styles.stepNumber}>3</div>
                <div className={styles.stepContent}>
                  <h3>Décrire votre problème</h3>
                  <p>Donnez le maximum de détails pour une résolution rapide</p>
                </div>
              </div>
              <div className={styles.step}>
                <div className={styles.stepNumber}>4</div>
                <div className={styles.stepContent}>
                  <h3>Suivre votre ticket</h3>
                  <p>Recevez des notifications et suivez l'avancement</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <span className={styles.cardIcon}>💡</span>
            <h2>Conseils pour un ticket efficace</h2>
          </div>
          <div className={styles.cardContent}>
            <div className={styles.tips}>
              <div className={styles.tip}>
                <strong>Soyez précis</strong> - Décrivez exactement ce qui ne fonctionne pas
              </div>
              <div className={styles.tip}>
                <strong>Ajoutez des captures d'écran</strong> - Une image vaut mille mots
              </div>
              <div className={styles.tip}>
                <strong>Indiquez votre environnement</strong> - Navigateur, système d'exploitation
              </div>
              <div className={styles.tip}>
                <strong>Étapes pour reproduire</strong> - Comment arriver au problème
              </div>
            </div>
          </div>
        </div>

        <div className={styles.actionSection}>
          <a 
            href="https://kempo-tournois.atlassian.net/servicedesk/customer/portal/1" 
            target="_blank" 
            rel="noopener noreferrer"
            className={styles.primaryButton}
          >
            <span className={styles.buttonIcon}>🎫</span>
            Créer un ticket de support
          </a>
          <p className={styles.actionNote}>
            Le portail s'ouvre dans un nouvel onglet - Gardez cette page ouverte pour référence
          </p>
        </div>

        <div className={styles.contactInfo}>
          <h3>Autres moyens de contact</h3>
          <div className={styles.contactMethods}>
            <div className={styles.contactMethod}>
              <span className={styles.contactIcon}>📧</span>
              <div>
                <strong>Email</strong>
                <p>support@kempo-tournois.com</p>
              </div>
            </div>
            <div className={styles.contactMethod}>
              <span className={styles.contactIcon}>⏰</span>
              <div>
                <strong>Heures de support</strong>
                <p>Lundi - Vendredi : 9h - 18h</p>
              </div>
            </div>
            <div className={styles.contactMethod}>
              <span className={styles.contactIcon}>⚡</span>
              <div>
                <strong>Temps de réponse</strong>
                <p>Moins de 24h en moyenne</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Support;
