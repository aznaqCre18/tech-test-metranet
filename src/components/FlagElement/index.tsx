type FlagElementTypes = {
    name: string
}

export default function FlagElement({ name }: FlagElementTypes) {
  return (
    <div className="flag-wrapper">
        <p className="flag-name">{name}</p>
    </div>
  )
}
