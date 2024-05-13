const HighlightedSection = ({ feedId, sectionId, entryCount, exitCount }) => {
    const [isHighlighted, setIsHighlighted] = useState(false);
    const sectionKey = `${feedId}-${sectionId}`;
  
    useEffect(() => {
      if (sectionsToHighlight.includes(sectionKey)) {
        setIsHighlighted(true);
        const timeoutId = setTimeout(() => {
          setIsHighlighted(false);
          setSectionsToHighlight((prevHighlights) =>
            prevHighlights.filter((key) => key !== sectionKey)
          );
        }, 1000); // Adjust the duration of the highlight as needed
  
        return () => clearTimeout(timeoutId);
      }
    }, [sectionsToHighlight, sectionKey]);
  
    return (
      <div className={`col ${isHighlighted ? 'highlighted' : ''}`}>
        <h8 className="card-title">Section : {sectionId}</h8>
        <div className="card">
          <div className="card-body">
            <p className="card-text">Entry: {entryCount || 0}</p>
            <p className="card-text">Exit: {exitCount || 0}</p>
          </div>
        </div>
      </div>
    );
  };