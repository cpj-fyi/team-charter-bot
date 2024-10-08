import React, { useState, useEffect } from 'react';
import { Save, Share2, Edit2, Plus, ArrowUp, ArrowDown } from 'lucide-react';
import { Input } from "./components/ui/input"
import { Textarea } from "./components/ui/textarea"
import { Button } from "./components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./components/ui/select"

const generateCharterID = () => {
  const adjectives = ['draft', 'final', 'new', 'revised'];
  const nouns = ['glass', 'paper', 'pen', 'book'];
  const colors = ['red', 'blue', 'green', 'yellow'];
  
  const randomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];
  
  return `${randomElement(adjectives)}-${randomElement(nouns)}-${randomElement(colors)}`;
};

const measureVerbs = ['Grow', 'Improve', 'Decrease', 'Maintain', 'Accelerate'];
const decisionRights = ['Decides', 'Informs', 'Consults', 'Executes'];

const TeamCharter = () => {
  const [charter, setCharter] = useState({
    mission: '',
    focusAreas: [],
    measures: [],
    decisions: [],
    roles: [{ name: '', focus: '' }]
  });
  const [editMode, setEditMode] = useState(true);
  const [charterID, setCharterID] = useState('');

  useEffect(() => {
    const id = generateCharterID();
    setCharterID(id);
  }, []);

  const handleInputChange = (e, field) => {
    setCharter({ ...charter, [field]: e.target.value });
  };

  const handleRoleChange = (index, field, value) => {
    const updatedRoles = [...charter.roles];
    updatedRoles[index][field] = value;
    setCharter({ ...charter, roles: updatedRoles });
  };

  const addRole = () => {
    setCharter({ ...charter, roles: [...charter.roles, { name: '', focus: '' }] });
  };

  const addFocusArea = () => {
    setCharter({ ...charter, focusAreas: [...charter.focusAreas, ''] });
  };

  const handleFocusAreaChange = (index, value) => {
    const updatedFocusAreas = [...charter.focusAreas];
    updatedFocusAreas[index] = value;
    setCharter({ ...charter, focusAreas: updatedFocusAreas });
  };

  const moveFocusArea = (index, direction) => {
    const updatedFocusAreas = [...charter.focusAreas];
    const temp = updatedFocusAreas[index];
    updatedFocusAreas[index] = updatedFocusAreas[index + direction];
    updatedFocusAreas[index + direction] = temp;
    setCharter({ ...charter, focusAreas: updatedFocusAreas });
  };

  const addMeasure = () => {
    setCharter({ ...charter, measures: [...charter.measures, { verb: '', description: '' }] });
  };

  const handleMeasureChange = (index, field, value) => {
    const updatedMeasures = [...charter.measures];
    updatedMeasures[index][field] = value;
    setCharter({ ...charter, measures: updatedMeasures });
  };

  const addDecision = () => {
    setCharter({ ...charter, decisions: [...charter.decisions, { name: '', rights: [] }] });
  };

  const handleDecisionChange = (index, field, value) => {
    const updatedDecisions = [...charter.decisions];
    if (field === 'rights') {
      const rightIndex = updatedDecisions[index].rights.indexOf(value);
      if (rightIndex > -1) {
        updatedDecisions[index].rights.splice(rightIndex, 1);
      } else {
        updatedDecisions[index].rights.push(value);
      }
    } else {
      updatedDecisions[index][field] = value;
    }
    setCharter({ ...charter, decisions: updatedDecisions });
  };

  const saveCharter = () => {
    // In a real app, this would save to a backend
    console.log('Saving charter:', charter);
    setEditMode(false);
  };

  const shareCharter = () => {
    const url = `https://teamcharter.com/p/${charterID}`;
    // In a real app, this would copy to clipboard
    console.log('Charter URL:', url);
    alert(`Charter URL: ${url}`);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 font-sans">
      <h1 className="text-3xl font-bold mb-6 text-center">Team Charter</h1>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-1">Mission</label>
          <Textarea
            value={charter.mission}
            onChange={(e) => handleInputChange(e, 'mission')}
            disabled={!editMode}
            placeholder="Enter team mission..."
            className="w-full p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Focus Areas</label>
          {charter.focusAreas.map((area, index) => (
            <div key={index} className="flex items-center space-x-2 mb-2">
              <Input
                value={area}
                onChange={(e) => handleFocusAreaChange(index, e.target.value)}
                disabled={!editMode}
                placeholder={`Focus Area ${index + 1}`}
                className="flex-grow"
              />
              {editMode && (
                <>
                  <Button 
                    onClick={() => moveFocusArea(index, -1)} 
                    disabled={index === 0}
                    variant="outline"
                    size="icon"
                  >
                    <ArrowUp className="h-4 w-4" />
                  </Button>
                  <Button 
                    onClick={() => moveFocusArea(index, 1)} 
                    disabled={index === charter.focusAreas.length - 1}
                    variant="outline"
                    size="icon"
                  >
                    <ArrowDown className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>
          ))}
          {editMode && (
            <Button onClick={addFocusArea} variant="outline" className="mt-2">
              <Plus className="w-4 h-4 mr-2" />
              Add Focus Area
            </Button>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Measures</label>
          {charter.measures.map((measure, index) => (
            <div key={index} className="flex space-x-2 mb-2">
              <Select
                value={measure.verb}
                onValueChange={(value) => handleMeasureChange(index, 'verb', value)}
                disabled={!editMode}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select verb" />
                </SelectTrigger>
                <SelectContent>
                  {measureVerbs.map((verb) => (
                    <SelectItem key={verb} value={verb}>{verb}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                value={measure.description}
                onChange={(e) => handleMeasureChange(index, 'description', e.target.value)}
                disabled={!editMode}
                placeholder="Measure description"
                className="flex-grow"
              />
            </div>
          ))}
          {editMode && (
            <Button onClick={addMeasure} variant="outline" className="mt-2">
              <Plus className="w-4 h-4 mr-2" />
              Add Measure
            </Button>
          )}
        </div>

        <div>
          <label className="block text