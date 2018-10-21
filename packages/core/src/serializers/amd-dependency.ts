import { AmdDependency } from 'typescript';

export interface SerializedAmdDependency {
  name?: string;
  path: string;
}

/**
 * Serialize a AmdDependency to a POJO
 * @param dep AmdDependency to serialize
 */
export default function serializeAmdDependency(dep: AmdDependency): SerializedAmdDependency {
  const { name, path } = dep;
  return { name, path };
}