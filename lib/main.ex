defmodule TheTragedyOfTheCommons.Main do
  alias TheTragedyOfTheCommons.Host
  alias TheTragedyOfTheCommons.Participant

  def init do
    %{
      participants: %{},
      participants_number: 0,
    }
  end

  def new_participant do
    %{
      id: nil
    }
  end

  def join(data, id) do
    unless Map.has_key?(data.participants, id) do
      new = new_participant()
      data
      |> put_in([:participants, id], new)
      |> Map.update!(:participants_number, fn n -> n + 1 end)
    else
      data
    end
  end

  def compute_diff(old, %{data: new} = result) do
    host = Map.get(result, :host, %{})
    participant = Map.get(result, :participant, %{})
    diff = JsonDiffEx.diff(old, new)
    participant_tasks = Enum.map(old.participants, fn {id, _} ->
      {id, Task.async(fn -> Participant.filter_data(diff, id, diff: true) end)}
    end)
    host_task = Task.async(fn -> Host.filter_data(diff, diff: true) end)
    host_diff = Task.await(host_task)
    participant_diff = Enum.map(participant_tasks, fn {id, task} -> {id, %{diff: Task.await(task)}} end)
                        |> Enum.filter(fn {_, map} -> map_size(map.diff) != 0 end)
                        |> Enum.into(%{})
    host = Map.merge(host, %{diff: host_diff})
    host = if map_size(host.diff) == 0 do
      Map.delete(host, :diff)
    else
      host
    end
    host = if map_size(host) == 0 do
      nil
    else
      host
    end
    participant = Map.merge(participant, participant_diff, fn _k, v1, v2 ->
      Map.merge(v1, v2)
    end)
    %{data: new, host: host, participant: participant}
  end
end
