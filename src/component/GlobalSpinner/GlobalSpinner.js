import React from 'react'
import { useTranslation } from 'react-i18next';
import './globalSpinner.css'
import {useGlobalSpinnerContext} from '../../context/GlobalSpinnerContext'

const GlobalSpinner = props => {
  const { t } = useTranslation();
  const isGlobalSpinnerOn = useGlobalSpinnerContext()
  return isGlobalSpinnerOn ? (
    <div className="global-spinner-overlay">
      <p>{t('Loading...')}</p>
    </div>
  ) : null
}

export default GlobalSpinner