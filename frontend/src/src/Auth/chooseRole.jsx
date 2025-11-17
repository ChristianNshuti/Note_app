import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import './chooseRole.css';
import { GraduationCap, Presentation, UserSquare } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { selectRole } from '../features/auth/authSlice';

const roleIcons = {
  student: { label: 'Student', icon: GraduationCap },
  teacher: { label: 'Teacher', icon: Presentation },
  admin: { label: 'Staff', icon: UserSquare },
};

export default function ChooseRole() {
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const verified = searchParams.get('verified') === 'true';
  const roleToken = searchParams.get('roleToken');
  const email = searchParams.get('email');

  const [availableRoles, setAvailableRoles] = useState([]);
  const [error, setError] = useState('');
  const [backendError, setBackendError] = useState('');

  useEffect(() => {
    if (!verified || !roleToken || !email) {
      setError('Email not verified. Please check your verification link.');
      return;
    }

    const fetchRoles = async () => {
      try {
        const response = await fetch('http://localhost:666/auth/getAvailableRoles', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ roleToken }),
          credentials: 'include',
        });

        if (!response.ok) throw new Error('No roles available. Please verify your email again.');

        const data = await response.json();
        if (Array.isArray(data.roles) && data.roles.length > 1) {
          setAvailableRoles(data.roles);
        } else {
          setError('No multiple roles available to select.');
        }
      } catch (err) {
        setError(err.message);
      }
    };

    fetchRoles();
  }, [verified, roleToken, email]);

  const handleRoleSelect = async (role) => {
    if (!email) {
      setError('Email not provided.');
      return;
    }

    try {
      const response = await dispatch(selectRole({ email, role })).unwrap();
      setBackendError('');
      const redirectUrl = response.redirectUrl || `http://${window.location.hostname}:5173`;
      window.location.href = redirectUrl;

    } catch (err) {
      setBackendError(err.message || 'Something went wrong while selecting role');
    }
  };

  if (error) {
    return (
      <div className="chooseRoleMain">
        <div className="roleCard">
          <h1>Error</h1>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="chooseRoleMain">
      <div className="roleCard">
        <h1>Please select your role</h1>
        <p>
          Choose the role you'd like to continue as.
        </p>
        <div className="roleOptions">
          {availableRoles
            .filter((role) => roleIcons[role.toLowerCase()])
            .map((role) => {
              const normalizedRole = role.toLowerCase();
              const { label, icon: Icon } = roleIcons[normalizedRole];
              return (
                <div
                  key={normalizedRole}
                  className="roleBox"
                  onClick={() => handleRoleSelect(normalizedRole)}
                >
                  <Icon size={44} />
                  <span>{label}</span>
                </div>
              );
            })}
        </div>
        {backendError && <p className="errorMsg">{backendError}</p>}
      </div>
    </div>
  );
}
