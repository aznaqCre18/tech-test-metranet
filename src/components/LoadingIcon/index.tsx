import { icons } from '../../configs'

export default function LoadingIcon() {
  return (
    <div className="loading-container">
      <div className='loading-wrapper'>
        <img className="loading-icon" src={icons.IC_POKEDEX} width={36} height={36} /> 
      </div>
    </div>
  )
}
