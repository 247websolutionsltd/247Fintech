import { createContext, useContext, useState, type Dispatch, type PropsWithChildren, type SetStateAction } from 'react';

export type ContactMethod = 'email' | 'phone';
export type IdentityDocumentType = 'passport' | 'national-id' | 'drivers-license';
export type KycReviewStatus = 'not-started' | 'pending' | 'verified' | 'failed';

type AuthFlowState = {
  method: ContactMethod;
  setMethod: Dispatch<SetStateAction<ContactMethod>>;
  contact: string;
  setContact: Dispatch<SetStateAction<string>>;
  password: string;
  setPassword: Dispatch<SetStateAction<string>>;
  pin: string;
  setPin: Dispatch<SetStateAction<string>>;
  fullName: string;
  setFullName: Dispatch<SetStateAction<string>>;
  dateOfBirth: string;
  setDateOfBirth: Dispatch<SetStateAction<string>>;
  gender: string;
  setGender: Dispatch<SetStateAction<string>>;
  address: string;
  setAddress: Dispatch<SetStateAction<string>>;
  city: string;
  setCity: Dispatch<SetStateAction<string>>;
  region: string;
  setRegion: Dispatch<SetStateAction<string>>;
  postalCode: string;
  setPostalCode: Dispatch<SetStateAction<string>>;
  country: string;
  setCountry: Dispatch<SetStateAction<string>>;
  identityType: IdentityDocumentType | null;
  setIdentityType: Dispatch<SetStateAction<IdentityDocumentType | null>>;
  idFrontUri: string | null;
  setIdFrontUri: Dispatch<SetStateAction<string | null>>;
  idBackUri: string | null;
  setIdBackUri: Dispatch<SetStateAction<string | null>>;
  selfieUri: string | null;
  setSelfieUri: Dispatch<SetStateAction<string | null>>;
  kycStatus: KycReviewStatus;
  setKycStatus: Dispatch<SetStateAction<KycReviewStatus>>;
};

const AuthFlowContext = createContext<AuthFlowState | null>(null);

export function AuthFlowProvider({ children }: PropsWithChildren) {
  const [method, setMethod] = useState<ContactMethod>('email');
  const [contact, setContact] = useState('');
  const [password, setPassword] = useState('');
  const [pin, setPin] = useState('');
  const [fullName, setFullName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [region, setRegion] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('');
  const [identityType, setIdentityType] = useState<IdentityDocumentType | null>(null);
  const [idFrontUri, setIdFrontUri] = useState<string | null>(null);
  const [idBackUri, setIdBackUri] = useState<string | null>(null);
  const [selfieUri, setSelfieUri] = useState<string | null>(null);
  const [kycStatus, setKycStatus] = useState<KycReviewStatus>('not-started');

  return (
    <AuthFlowContext.Provider value={{
      method, setMethod, contact, setContact, password, setPassword, pin, setPin,
      fullName, setFullName, dateOfBirth, setDateOfBirth, gender, setGender,
      address, setAddress, city, setCity, region, setRegion, postalCode, setPostalCode, country, setCountry,
      identityType, setIdentityType, idFrontUri, setIdFrontUri, idBackUri, setIdBackUri,
      selfieUri, setSelfieUri, kycStatus, setKycStatus,
    }}>
      {children}
    </AuthFlowContext.Provider>
  );
}

export function useAuthFlow() {
  const context = useContext(AuthFlowContext);
  if (!context) throw new Error('useAuthFlow must be used within AuthFlowProvider');
  return context;
}
