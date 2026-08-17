export interface Machine {
  id: string;
  name: string;
}

export interface SubSection {
  id: string;
  name: string;
  machines: Machine[];
}

export interface Line {
  id: string;
  name: string;
  subsections: SubSection[];
}

export interface Section {
  id: string;
  name: string;
  lines: Line[];
}

export interface Department {
  id: string;
  name: string;
  sections: Section[];
}